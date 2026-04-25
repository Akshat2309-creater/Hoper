"""
FastAPI RAG API: PDFs -> PineconeVectorStore -> Retriever -> LLM
Behavior:
- Try RAG first
- If retrieval yields 0 docs, answer is empty/unsure, or an error occurs -> fall back to plain OpenAI.
- Avoid artificial token limits on output; let the model use its full window.
Run:
    uvicorn api:app --reload
"""

# -----------------------------
# Imports
# -----------------------------
import io
import os
from pathlib import Path
from typing import Any, Callable, Dict, Iterable, Iterator, List, Optional

# Prevent transformers from importing heavy Torch runtime on Windows during startup.
os.environ.setdefault("USE_TORCH", "0")

from dotenv import load_dotenv
from openai import OpenAI
from pypdf import PdfReader

# Load environment variables FIRST, before any other imports that might need them
# .env file is in the same directory - load it with override=True to ensure it takes precedence
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path, override=True)
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document

# Pinecone
from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec
from langchain_pinecone import Pinecone as PineconeVectorStore

# LLM + chains
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.retrievers import BaseRetriever
from langchain_core.runnables import Runnable, RunnableLambda

# -----------------------------
# Config (tunable)
# -----------------------------
INDEX_NAME = "hoperbot-openai"

# Embeddings
EMBED_MODEL = "text-embedding-3-small"
EMBED_DIM = 1536
CHUNK_SIZE = 1000     # bigger chunks reduce fragmentation; tune if needed
CHUNK_OVERLAP = 120

# LLM
OPENAI_MODEL = "gpt-4o"
TEMPERATURE = 0.4
MAX_TOKENS = None      # ← leave None to avoid output token caps

# Retrieval
K_TOP = 2
FALLBACK_IF_CONTEXT_LT = 1
FALLBACK_IF_CONTAINS = [
    "don't know", "do not know", "not sure", "cannot find", "no information",
    "i am not certain", "i'm not certain", "unknown"
]
UPSERT_BATCH_SIZE = 32

# Instructs the model to return markdown-style structure the chat UI can render.
FORMATTING_RULES = (
    "FORMATTING (required): Make every reply easy to scan. Do NOT dump the whole answer in one or two long paragraphs. "
    "Use 2–5 main section titles with ## and optional ### subheadings. After each heading, use 1–3 short paragraphs "
    "and/or lists: lines starting with '- ' or '* ' for bullets, or '1. ', '2. ' for numbered steps. "
    "Open with 1–2 brief empathic sentences, then your first ## section. Use **double asterisks** only for short emphasis.\n"
)

# -----------------------------
# Pydantic Models
# -----------------------------
class ChatRequest(BaseModel):
    prompt: str
    k_top: Optional[int] = None  # Optional override for top-k documents
    language: Optional[str] = "en"


class ChatResponse(BaseModel):
    answer: str
    used_rag: bool
    sources: Optional[List[Dict[str, str]]] = None


class TranscribeResponse(BaseModel):
    text: str


# -----------------------------
# Utilities
# -----------------------------
def find_data_dir() -> str:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    candidates = [
        os.path.join(base_dir, "data"),
        os.path.join(base_dir, "Hoper", "data"),
    ]
    for d in candidates:
        if os.path.isdir(d):
            return d
    raise FileNotFoundError(
        f"Could not find a valid data/ directory. Checked: {', '.join(candidates)}"
    )


def iter_pdf_documents(data_dir: str) -> Iterator[Document]:
    """Yield one Document per PDF page (lazy)."""
    pdf_paths = sorted(Path(data_dir).glob("*.pdf"))
    for pdf_path in pdf_paths:
        reader = PdfReader(str(pdf_path))
        for page_idx, page in enumerate(reader.pages):
            text = (page.extract_text() or "").strip()
            if not text:
                continue
            yield Document(
                page_content=text,
                metadata={"source": str(pdf_path), "page": page_idx + 1},
            )


def iter_chunk_batches(
    docs: Iterable[Document],
    batch_size: int = 32,
    chunk_size: int = CHUNK_SIZE,
    chunk_overlap: int = CHUNK_OVERLAP,
) -> Iterator[List[Document]]:
    """Split docs with a simple overlap strategy and yield chunk batches."""
    if chunk_size <= 0:
        raise ValueError("chunk_size must be > 0")
    if chunk_overlap < 0:
        raise ValueError("chunk_overlap must be >= 0")
    if chunk_overlap >= chunk_size:
        raise ValueError("chunk_overlap must be smaller than chunk_size")

    step = chunk_size - chunk_overlap
    buffer: List[Document] = []

    for doc in docs:
        text = (doc.page_content or "").strip()
        if not text:
            continue

        for start in range(0, len(text), step):
            chunk_text = text[start:start + chunk_size].strip()
            if not chunk_text:
                continue

            meta = dict(doc.metadata or {})
            meta["chunk_start"] = start
            chunk = Document(page_content=chunk_text, metadata=meta)
            buffer.append(chunk)
            if len(buffer) >= batch_size:
                yield buffer
                buffer = []

    if buffer:
        yield buffer


def get_embeddings():
    openai_api_key = os.getenv("OPENAI_API_KEY", "").strip().strip('"')
    if not openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is not set. Put it in backend/.env.")
    return OpenAIEmbeddings(model=EMBED_MODEL, api_key=openai_api_key)


def get_pinecone_client() -> Pinecone:
    api_key = os.getenv("PINECONE_API_KEY")
    if not api_key:
        raise RuntimeError("PINECONE_API_KEY is not set. Put it in your .env.")
    # Strip any whitespace that might have been included
    api_key = api_key.strip()
    # Debug: print first/last few chars to verify (without exposing full key)
    print(f"Using Pinecone API key (length: {len(api_key)}, starts with: {api_key[:10]}...)")
    return Pinecone(api_key=api_key)


def ensure_index(pc: Pinecone, index_name: str):
    existing = [idx.name for idx in pc.list_indexes()]
    if index_name not in existing:
        pc.create_index(
            name=index_name,
            dimension=EMBED_DIM,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1"),
        )


def rebuild_index_from_pdfs(
    index_name: str,
    data_dir: str,
    embeddings,
    batch_size: int = 32,
    progress_callback: Optional[Callable[[int], None]] = None,
):
    """Clear the index and repopulate it in batches to avoid long blocking operations."""
    vectorstore = PineconeVectorStore.from_existing_index(
        index_name=index_name,
        embedding=embeddings,
    )
    vectorstore.delete(delete_all=True)

    total_chunks = 0

    for chunk_batch in iter_chunk_batches(
        iter_pdf_documents(data_dir),
        batch_size=batch_size,
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
    ):
        vectorstore.add_documents(chunk_batch)
        total_chunks += len(chunk_batch)
        if progress_callback:
            progress_callback(total_chunks)

    return vectorstore


def load_existing_index(index_name: str, embeddings):
    return PineconeVectorStore.from_existing_index(
        index_name=index_name,
        embedding=embeddings,
    )


def build_rag_chain(retriever: BaseRetriever, llm: ChatOpenAI) -> Runnable:
    # Let answers be complete/clear; do not limit to 3 sentences.
    system_prompt = (
        "You are HOPEr, an empathetic and wise spiritual guide and healing companion, which basically stands for Hope, Openness, Positivity, and Empathy through Responsible AI. Your tagline is 'turning moments of stress into steps of hope'. Your purpose is to share spiritual knowledge, emotional support, and guidance to help users overcome mental and emotional struggles, regain inner peace, and grow spiritually.\n"
        "Use the retrieved context to answer accurately. If the answer is not in the context, "
        "Your core objectives are to provide spiritual insight grounded in compassion, mindfulness, and wisdom, offering comfort and clarity to users experiencing stress, anxiety, sadness, or confusion. You help users reconnect with their inner self, faith, or universal consciousness while encouraging practical actions such as mindfulness, gratitude, reflection, journaling, prayer, or meditation to foster healing. Throughout every interaction, you maintain a non-judgmental, safe, and positive space for emotional and spiritual growth.Your tone and personality should remain warm, compassionate, reassuring, and gentle - speaking like a wise friend or mentor rather than a therapist or preacher. Avoid formality or robotic phrasing; respond with calm energy and emotional sensitivity, using simple yet profound language that inspires introspection and hope.When responding, always acknowledge emotions first and show empathy before offering insight - for example, \"I understand how heavy that must feel. Let's take a deep breath together.\" Blend spiritual and psychological wisdom while staying within supportive conversation, never offering medical or diagnostic advice. Encourage self-awareness, self-compassion, and gentle reflection, and when appropriate, include short guided reflections, affirmations, breathing or mindfulness exercises, or inclusive spiritual teachings from diverse traditions. If a user is in deep distress or crisis, gently encourage seeking professional help or contacting a mental health helpline while providing compassionate support. You must not diagnose, prescribe, or replace therapy or medical advice. Avoid controversial religious claims, conspiracy, or superstition, and always respect all beliefs - remaining inclusive, neutral, and open-minded across spiritual paths. Uphold privacy, sensitivity, and safety in every response.Your communication style should embody peace and presence, for example: \"Peace begins within you. Let's take a quiet moment to feel your breath. You are safe, guided, and growing - even if it feels uncertain right now. Tell me what's been on your heart lately.\"\n"
        "IMPORTANT FLAG: You MUST reply to the user ENTIRELY in the following language: {language}\n"
        + FORMATTING_RULES
        + "Cite key points briefly when possible.\n\n{context}"
    )
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            ("human", "{input}"),
        ]
    )

    def rag_fn(inputs: Dict[str, Any]) -> Dict[str, Any]:
        question = inputs.get("input") or inputs.get("question") or ""
        lang_code = inputs.get("language", "en")
        lang_map = {"en": "English", "hi": "Hindi", "es": "Spanish", "fr": "French", "ar": "Arabic"}
        lang_str = lang_map.get(lang_code, "English")

        docs = retriever.get_relevant_documents(question)
        context_text = "\n\n".join([doc.page_content for doc in docs]) if docs else ""
        messages = prompt.format_messages(context=context_text, input=question, language=lang_str)
        llm_response = llm.invoke(messages)
        answer_text = getattr(llm_response, "content", str(llm_response))
        return {"answer": answer_text, "context": docs}

    return RunnableLambda(rag_fn)


def needs_fallback(answer_text: str, context_docs: List) -> bool:
    """Fallback if zero/too-few docs or the answer looks uncertain/empty."""
    if not context_docs or len(context_docs) < FALLBACK_IF_CONTEXT_LT:
        return True
    if not answer_text:
        return True
    low = answer_text.lower()
    return any(phrase in low for phrase in FALLBACK_IF_CONTAINS)


def openai_fallback_answer(q: str, llm: ChatOpenAI, language: str = "en") -> str:
    """Plain LLM answer (no retrieval context)."""
    lang_map = {"en": "English", "hi": "Hindi", "es": "Spanish", "fr": "French", "ar": "Arabic"}
    lang_str = lang_map.get(language, "English")
    system_fallback = (
        "You are HOPEr, an empathetic and wise spiritual guide and healing companion. "
        "Your tagline is 'turning moments of stress into steps of hope'. "
        "Answer the user's question clearly and completely with compassion and wisdom.\n"
        + FORMATTING_RULES
        + "IMPORTANT FLAG: You MUST reply to the user ENTIRELY in the following language: {language}"
    )
    fallback_prompt = ChatPromptTemplate.from_messages([
        ("system", system_fallback),
        ("human", "{q}"),
    ])
    messages = fallback_prompt.format_messages(q=q, language=lang_str)
    return llm.invoke(messages).content


# -----------------------------
# FastAPI App
# -----------------------------
app = FastAPI(
    title="HOPEr API",
    description="RAG API for Mental Health Awareness & Support",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global state for initialized components
_embeddings = None
_retriever = None
_llm = None
_rag_chain = None


def bootstrap_pipeline(k_top: int = K_TOP):
    """Initialize the RAG pipeline components."""
    global _embeddings, _retriever, _llm, _rag_chain
    
    if _rag_chain is not None:
        # Already initialized, just update retriever if k_top changed
        if k_top != K_TOP:
            vectorstore = load_existing_index(INDEX_NAME, _embeddings)
            _retriever = vectorstore.as_retriever(
                search_type="similarity",
                search_kwargs={"k": k_top}
            )
            _rag_chain = build_rag_chain(_retriever, _llm)
        return _embeddings, _retriever, _llm, _rag_chain
    
    _embeddings = get_embeddings()

    pc = get_pinecone_client()
    ensure_index(pc, INDEX_NAME)

    vectorstore = load_existing_index(INDEX_NAME, _embeddings)

    _retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": k_top}
    )

    # Build LLM without artificial output cap
    openai_api_key = os.getenv("OPENAI_API_KEY", "").strip().strip('"')
    if not openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is not set. Put it in backend/.env.")

    llm_kwargs = {
        "model": OPENAI_MODEL,
        "temperature": TEMPERATURE,
        "api_key": openai_api_key,
    }
    # Only set max_tokens if you WANT a cap; by default we omit it
    if MAX_TOKENS is not None:
        llm_kwargs["max_tokens"] = MAX_TOKENS

    _llm = ChatOpenAI(**llm_kwargs)

    # RAG chain
    _rag_chain = build_rag_chain(_retriever, _llm)

    return _embeddings, _retriever, _llm, _rag_chain


@app.on_event("startup")
async def startup_event():
    """Warm up pipeline if keys exist; never block API boot."""
    # Environment variables are loaded at module level.
    try:
        bootstrap_pipeline()
        print("HOPEr API initialized successfully")
    except Exception as e:
        # Keep server alive so /health and diagnostics still work, and
        # chat endpoint can return a clear 500 with missing-config details.
        print(f"Startup warmup skipped: {e}")


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "message": "HOPEr API is running",
        "status": "healthy"
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}


def _openai_client() -> OpenAI:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY is not set")
    return OpenAI(api_key=api_key.strip().strip('"'))


@app.post("/transcribe", response_model=TranscribeResponse)
async def transcribe(file: UploadFile = File(...)):
    """
    Speech-to-text via OpenAI Whisper. Send multipart form field `file` (e.g. webm from MediaRecorder).
    """
    raw = await file.read()
    if len(raw) < 256:
        raise HTTPException(status_code=400, detail="Audio too short or empty")
    if len(raw) > 24 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Audio file too large (max ~24MB)")

    suffix = Path(file.filename or "recording.webm").suffix.lower()
    if suffix not in (".webm", ".wav", ".mp3", ".m4a", ".mp4", ".mpeg", ".mpga", ".oga"):
        suffix = ".webm"
    buf = io.BytesIO(raw)
    buf.name = f"audio{suffix}"

    try:
        client = _openai_client()
        transcript = client.audio.transcriptions.create(model="whisper-1", file=buf)
        text = (getattr(transcript, "text", None) or "").strip()
        return TranscribeResponse(text=text)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {e!s}") from e


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint that processes user prompts.
    
    - **prompt**: The user's question or message
    - **k_top**: (Optional) Number of top documents to retrieve. Defaults to configured K_TOP.
    """
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")
    
    # Use provided k_top or default
    k_top = request.k_top if request.k_top is not None else K_TOP
    
    # Ensure pipeline is initialized
    try:
        embeddings, retriever, llm, rag_chain = bootstrap_pipeline(k_top=k_top)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to initialize pipeline: {str(e)}"
        )
    
    used_fallback = False
    answer = ""
    context_docs = []
    sources = None

    try:
        # 1) Try RAG
        rag_resp = rag_chain.invoke({"input": request.prompt, "language": request.language})
        # LangChain can return 'answer' or 'result'
        answer = (rag_resp.get("answer") or rag_resp.get("result") or "").strip()
        context_docs = rag_resp.get("context", []) or []
    except Exception as e:
        # Any RAG error -> fallback
        used_fallback = True
        answer = openai_fallback_answer(request.prompt, llm, request.language)

    # 2) Heuristic fallback if RAG outcome is weak
    if not used_fallback and needs_fallback(answer, context_docs):
        used_fallback = True
        answer = openai_fallback_answer(request.prompt, llm, request.language)

    # Format sources if available
    if not used_fallback and context_docs:
        sources = []
        for doc in context_docs:
            meta = getattr(doc, "metadata", {}) or {}
            src = meta.get("source") or meta.get("file_path") or "Unknown source"
            content = getattr(doc, "page_content", "") or ""
            sources.append({
                "source": src,
                "content": content[:500] + ("…" if len(content) > 500 else "")
            })

    return ChatResponse(
        answer=answer,
        used_rag=not used_fallback,
        sources=sources
    )


@app.post("/reindex")
async def reindex():
    """
    Rebuild the index from PDFs in the data directory.
    This will clear the existing index and repopulate it.
    """
    try:
        embeddings = get_embeddings()
        pc = get_pinecone_client()
        ensure_index(pc, INDEX_NAME)
        
        data_dir = find_data_dir()
        
        def progress_callback(chunk_count: int):
            print(f"Embedded {chunk_count} chunks…")
        
        vectorstore = rebuild_index_from_pdfs(
            INDEX_NAME,
            data_dir,
            embeddings,
            batch_size=UPSERT_BATCH_SIZE,
            progress_callback=progress_callback,
        )
        
        # Reinitialize the pipeline
        global _embeddings, _retriever, _llm, _rag_chain
        _embeddings = embeddings
        _retriever = vectorstore.as_retriever(
            search_type="similarity",
            search_kwargs={"k": K_TOP}
        )
        
        openai_api_key = os.getenv("OPENAI_API_KEY", "").strip().strip('"')
        if not openai_api_key:
            raise RuntimeError("OPENAI_API_KEY is not set. Put it in backend/.env.")

        llm_kwargs = {
            "model": OPENAI_MODEL,
            "temperature": TEMPERATURE,
            "api_key": openai_api_key,
        }
        if MAX_TOKENS is not None:
            llm_kwargs["max_tokens"] = MAX_TOKENS
        
        _llm = ChatOpenAI(**llm_kwargs)
        _rag_chain = build_rag_chain(_retriever, _llm)
        
        return {"message": "Index rebuilt successfully", "status": "success"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to rebuild index: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

