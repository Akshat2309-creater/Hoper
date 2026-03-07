# # app.py
# """
# Streamlit RAG app: PDFs -> Pinecone -> Retriever -> LLM
# - Tries RAG first
# - If no good context or the LLM says "don't know", falls back to plain OpenAI
# Run:
#     streamlit run app.py
# """

# # -----------------------------
# # Imports
# # -----------------------------
# import os
# from typing import List, Tuple

# import streamlit as st
# from dotenv import load_dotenv

# # LangChain (new split packages)
# from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
# from langchain_text_splitters import RecursiveCharacterTextSplitter
# from langchain_huggingface import HuggingFaceEmbeddings

# # Pinecone
# from pinecone.grpc import PineconeGRPC as Pinecone
# from pinecone import ServerlessSpec
# from langchain_pinecone import PineconeVectorStore

# # LLM + chains
# from langchain_openai import ChatOpenAI
# from langchain.chains import create_retrieval_chain
# from langchain.chains.combine_documents import create_stuff_documents_chain
# from langchain_core.prompts import ChatPromptTemplate


# # -----------------------------
# # Config
# # -----------------------------
# INDEX_NAME = "hoperbot"
# EMBED_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
# EMBED_DIM = 384
# CHUNK_SIZE = 500
# CHUNK_OVERLAP = 20

# OPENAI_MODEL = "gpt-5"
# TEMPERATURE = 0.4
# MAX_TOKENS = 1000

# K_TOP = 3                       # default top-k documents
# FALLBACK_IF_CONTEXT_LT = 1      # fallback if fewer than this many docs returned
# FALLBACK_IF_CONTAINS = ["don't know", "do not know", "not sure"]  # simple heuristic


# # -----------------------------
# # Utilities
# # -----------------------------
# def find_data_dir() -> str:
#     base_dir = os.path.dirname(os.path.abspath(__file__))
#     candidates = [
#         os.path.join(base_dir, "data"),
#         os.path.join(base_dir, "Hoper", "data"),
#     ]
#     for d in candidates:
#         if os.path.isdir(d):
#             return d
#     raise FileNotFoundError(f"Could not find a valid data/ directory. Checked: {', '.join(candidates)}")


# def load_pdfs(data_dir: str):
#     loader = DirectoryLoader(data_dir, glob="*.pdf", loader_cls=PyPDFLoader)
#     return loader.load()


# def split_docs(docs):
#     splitter = RecursiveCharacterTextSplitter(chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP)
#     return splitter.split_documents(docs)


# def get_embeddings():
#     return HuggingFaceEmbeddings(model_name=EMBED_MODEL)


# def get_pinecone_client() -> Pinecone:
#     api_key = os.getenv("PINECONE_API_KEY")
#     if not api_key:
#         raise RuntimeError("PINECONE_API_KEY is not set. Put it in your .env.")
#     return Pinecone(api_key=api_key)


# def ensure_index(pc: Pinecone, index_name: str):
#     existing = [idx.name for idx in pc.list_indexes()]
#     if index_name not in existing:
#         pc.create_index(
#             name=index_name,
#             dimension=EMBED_DIM,
#             metric="cosine",
#             spec=ServerlessSpec(cloud="aws", region="us-east-1"),
#         )


# def upsert_chunks(index_name: str, chunks, embeddings):
#     return PineconeVectorStore.from_documents(
#         documents=chunks,
#         index_name=index_name,
#         embedding=embeddings,
#     )


# def load_existing_index(index_name: str, embeddings):
#     return PineconeVectorStore.from_existing_index(
#         index_name=index_name,
#         embedding=embeddings,
#     )


# def build_rag_chain(retriever, llm):
#     system_prompt = (
#         "You are an assistant for question-answering tasks. "
#         "Use the following pieces of retrieved context to answer the question. "
#         "If you don't know the answer, say that you don't know. "
#         "Use three sentences maximum and keep the answer concise.\n\n{context}"
#     )
#     prompt = ChatPromptTemplate.from_messages([
#         ("system", system_prompt),
#         ("human", "{input}"),
#     ])
#     qa_chain = create_stuff_documents_chain(llm, prompt)
#     return create_retrieval_chain(retriever, qa_chain)


# def needs_fallback(answer_text: str, context_docs: List) -> bool:
#     """Heuristic: if no/too-few docs OR LLM expressed uncertainty → fallback to pure LLM."""
#     if len(context_docs) < FALLBACK_IF_CONTEXT_LT:
#         return True
#     low = answer_text.lower()
#     return any(phrase in low for phrase in FALLBACK_IF_CONTAINS)


# # -----------------------------
# # Streamlit App
# # -----------------------------
# st.set_page_config(page_title="RAG over PDFs (Pinecone + OpenAI)", page_icon="📚")
# st.title("HOPEr ")

# with st.sidebar:
#     st.header("Settings")
#     load_dotenv()
#     UPSERT_DATA = st.toggle("(Re)Embed & upsert PDFs on start", value=False,
#                             help="Turn on if you've changed PDFs and want to reindex.")
#     k = st.slider("Top-k documents", min_value=1, max_value=10, value=K_TOP, step=1)
#     st.caption("Make sure your `.env` contains OPENAI_API_KEY and PINECONE_API_KEY.")

# # Cache heavy initializations so Streamlit doesn't rebuild everything on each input
# @st.cache_resource(show_spinner=True)
# def bootstrap_pipeline(upsert: bool, k_top: int):
#     # Embeddings
#     embeddings = get_embeddings()

#     # Pinecone
#     pc = get_pinecone_client()
#     ensure_index(pc, INDEX_NAME)

#     # Upsert or connect
#     if upsert:
#         data_dir = find_data_dir()
#         docs = load_pdfs(data_dir)
#         chunks = split_docs(docs)
#         vectorstore = upsert_chunks(INDEX_NAME, chunks, embeddings)
#     else:
#         vectorstore = load_existing_index(INDEX_NAME, embeddings)

#     # Retriever
#     retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": k_top})

#     # LLM
#     llm = ChatOpenAI(model=OPENAI_MODEL, temperature=TEMPERATURE, max_tokens=MAX_TOKENS)

#     # RAG chain
#     rag_chain = build_rag_chain(retriever, llm)

#     return embeddings, retriever, llm, rag_chain


# with st.spinner("Initializing…"):
#     embeddings, retriever, llm, rag_chain = bootstrap_pipeline(UPSERT_DATA, k)

# # Input
# query = st.text_input("Ask a question about your PDFs:", placeholder="e.g., What is Mental Health?")
# go = st.button("Ask")

# if go and query.strip():
#     with st.spinner("Thinking…"):
#         # 1) Try RAG first
#         rag_resp = rag_chain.invoke({"input": query})
#         answer = rag_resp.get("answer", rag_resp.get("result", "")).strip()
#         context_docs = rag_resp.get("context", [])

#         used_fallback = False
#         # 2) Decide if we should fallback to pure LLM (no retrieval)
#         if needs_fallback(answer, context_docs):
#             used_fallback = True
#             # Plain LLM answer (no context)
#             system_fallback = (
#                 "You are a helpful assistant. Answer the user's question clearly and concisely."
#             )
#             fallback_prompt = ChatPromptTemplate.from_messages([
#                 ("system", system_fallback),
#                 ("human", "{q}"),
#             ])
#             # Simple one-off call
#             messages = fallback_prompt.format_messages(q=query)
#             answer = llm.invoke(messages).content

#     # Output
#     st.subheader("Answer")
#     badge = "🔎 RAG" if not used_fallback else "🌐 OpenAI fallback"
#     st.markdown(f"**{badge}**")
#     st.write(answer)

#     # Sources (only meaningful for RAG path)
#     if not used_fallback and context_docs:
#         with st.expander("Show sources (top chunks)"):
#             for i, doc in enumerate(context_docs, 1):
#                 meta = getattr(doc, "metadata", {})
#                 src = meta.get("source") or meta.get("file_path") or "Unknown source"
#                 st.markdown(f"**Source {i}:** {src}")
#                 st.caption(doc.page_content[:700] + ("…" if len(doc.page_content) > 700 else ""))

#     # Debug/tips
#     st.caption(
#         "Tip: If you frequently see the OpenAI fallback, consider adding more documents, "
#         "using larger chunks, or increasing top-k."
#     )
















# app.py
"""
Streamlit RAG app: PDFs -> Pinecone -> Retriever -> LLM
Behavior:
- Try RAG first
- If retrieval yields 0 docs, answer is empty/unsure, or an error occurs -> fall back to plain OpenAI.
- Avoid artificial token limits on output; let the model use its full window.
Run:
    streamlit run app.py
"""

# -----------------------------
# Imports
# -----------------------------
import os
from pathlib import Path
from typing import Any, Callable, Dict, Iterable, Iterator, List, Optional

import streamlit as st
from dotenv import load_dotenv

# LangChain split packages
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings

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
INDEX_NAME = "hoperbot"
PROJECT_ROOT = Path(__file__).resolve().parents[2]
FAVICON_PATH = PROJECT_ROOT / "public" / "favicon.ico"
PAGE_ICON = str(FAVICON_PATH) if FAVICON_PATH.exists() else "📚"

# Embeddings
EMBED_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
EMBED_DIM = 384
CHUNK_SIZE = 1000     # bigger chunks reduce fragmentation; tune if needed
CHUNK_OVERLAP = 120

# LLM
OPENAI_MODEL = "gpt-5"
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

def iter_pdf_documents(data_dir: str) -> Iterator:
    """Yield PDF Documents lazily so we don't reload everything repeatedly."""
    loader = DirectoryLoader(data_dir, glob="*.pdf", loader_cls=PyPDFLoader)
    yield from loader.lazy_load()


def build_splitter() -> RecursiveCharacterTextSplitter:
    return RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
    )


def iter_chunk_batches(
    docs: Iterable,
    batch_size: int = 32,
    splitter: Optional[RecursiveCharacterTextSplitter] = None,
) -> Iterator[List]:
    """Split docs and yield batches of chunks to keep processing responsive."""
    splitter = splitter or build_splitter()
    buffer: List = []

    for doc in docs:
        for chunk in splitter.split_documents([doc]):
            buffer.append(chunk)
            if len(buffer) >= batch_size:
                yield buffer
                buffer = []

    if buffer:
        yield buffer

def get_embeddings():
    return HuggingFaceEmbeddings(model_name=EMBED_MODEL)

def get_pinecone_client() -> Pinecone:
    api_key = os.getenv("PINECONE_API_KEY")
    if not api_key:
        raise RuntimeError("PINECONE_API_KEY is not set. Put it in your .env.")
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

    splitter = build_splitter()
    total_chunks = 0

    for chunk_batch in iter_chunk_batches(
        iter_pdf_documents(data_dir),
        batch_size=batch_size,
        splitter=splitter,
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
        "Your core objectives are to provide spiritual insight grounded in compassion, mindfulness, and wisdom, offering comfort and clarity to users experiencing stress, anxiety, sadness, or confusion. You help users reconnect with their inner self, faith, or universal consciousness while encouraging practical actions such as mindfulness, gratitude, reflection, journaling, prayer, or meditation to foster healing. Throughout every interaction, you maintain a non-judgmental, safe, and positive space for emotional and spiritual growth.Your tone and personality should remain warm, compassionate, reassuring, and gentle — speaking like a wise friend or mentor rather than a therapist or preacher. Avoid formality or robotic phrasing; respond with calm energy and emotional sensitivity, using simple yet profound language that inspires introspection and hope.When responding, always acknowledge emotions first and show empathy before offering insight — for example, “I understand how heavy that must feel. Let’s take a deep breath together.” Blend spiritual and psychological wisdom while staying within supportive conversation, never offering medical or diagnostic advice. Encourage self-awareness, self-compassion, and gentle reflection, and when appropriate, include short guided reflections, affirmations, breathing or mindfulness exercises, or inclusive spiritual teachings from diverse traditions. If a user is in deep distress or crisis, gently encourage seeking professional help or contacting a mental health helpline while providing compassionate support. You must not diagnose, prescribe, or replace therapy or medical advice. Avoid controversial religious claims, conspiracy, or superstition, and always respect all beliefs — remaining inclusive, neutral, and open-minded across spiritual paths. Uphold privacy, sensitivity, and safety in every response.Your communication style should embody peace and presence, for example: “Peace begins within you. Let’s take a quiet moment to feel your breath. You are safe, guided, and growing — even if it feels uncertain right now. Tell me what’s been on your heart lately.”\n"
        "Cite key points briefly when possible.\n\n{context}"
    )
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            ("human", "{input}"),
        ]
    )

    def rag_fn(inputs: Dict[str, Any]) -> Dict[str, Any]:
        question = inputs.get("input") or inputs.get("question") or ""
        docs = retriever.get_relevant_documents(question)
        context_text = "\n\n".join([doc.page_content for doc in docs]) if docs else ""
        messages = prompt.format_messages(context=context_text, input=question)
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

# -----------------------------
# Streamlit App
# -----------------------------
st.set_page_config(
    page_title="HOPEr - Mental Health Awareness & Support",
    page_icon=PAGE_ICON,
    layout="wide",
    initial_sidebar_state="collapsed",
)
st.markdown(
    "<h1 style='text-align:center; margin-bottom: 0.2rem; color:#F4B731;'>HOPEr</h1>",
    unsafe_allow_html=True,
)
st.markdown(
    "<p style='text-align:center; color:rgba(255,255,255,0.7); margin-top:0;'>Turning moments of stress into steps of hope.</p>",
    unsafe_allow_html=True,
)

with st.sidebar:
    st.header("Settings")
    load_dotenv()
    UPSERT_DATA = st.toggle(
        "(Re)Embed & upsert PDFs on start",
        value=False,
        help="Enable if you've changed PDFs and want to (re)index."
    )
    k = st.slider("Top-k documents", min_value=1, max_value=20, value=K_TOP, step=1)
    st.caption("Your `.env` must contain OPENAI_API_KEY and PINECONE_API_KEY.")

@st.cache_resource(show_spinner=True)
def bootstrap_pipeline(upsert: bool, k_top: int):
    embeddings = get_embeddings()

    pc = get_pinecone_client()
    ensure_index(pc, INDEX_NAME)

    if upsert:
        data_dir = find_data_dir()
        progress_placeholder = st.empty()

        def update_progress(chunk_count: int):
            progress_placeholder.info(f"Embedded {chunk_count} chunks…")

        vectorstore = rebuild_index_from_pdfs(
            INDEX_NAME,
            data_dir,
            embeddings,
            batch_size=UPSERT_BATCH_SIZE,
            progress_callback=update_progress,
        )
        progress_placeholder.empty()
    else:
        vectorstore = load_existing_index(INDEX_NAME, embeddings)

    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": k_top}
    )

    # Build LLM without artificial output cap
    llm_kwargs = {
        "model": OPENAI_MODEL,
        "temperature": TEMPERATURE,
    }
    # Only set max_tokens if you WANT a cap; by default we omit it
    if MAX_TOKENS is not None:
        llm_kwargs["max_tokens"] = MAX_TOKENS

    llm = ChatOpenAI(**llm_kwargs)

    # RAG chain
    rag_chain = build_rag_chain(retriever, llm)

    return embeddings, retriever, llm, rag_chain

with st.spinner("Initializing…"):
    embeddings, retriever, llm, rag_chain = bootstrap_pipeline(UPSERT_DATA, k)

# Input (fixed height, button below)
TEXT_INPUT_HEIGHT = 136

st.markdown(
    """
    <style>
        [data-testid="stTextArea"] textarea {
            background-color: #C6B9E0 !important;
            color: #2E2450 !important;
            resize: none !important;
            border: none;
            box-shadow: none;
        }
        [data-testid="stTextArea"] textarea::placeholder {
            color: rgba(46,36,80,0.6);
        }
        [data-testid="stTextArea"] textarea:focus {
            border: none;
            box-shadow: none;
            outline: none;
        }
        div[data-testid="stButton"] button {
            height: 48px;
            width: 160px;
            background-color: #6C4AB6;
            color: #FFFFFF;
            border: 3px solid #472A80;
            font-weight: 600;
        }
        div[data-testid="stButton"] button:hover {
            background-color: #5935A1;
            border-color: #2E1E67;
        }
    </style>
    """,
    unsafe_allow_html=True,
)

query = st.text_area(
    label="",
    placeholder="Share what's on your heart, and HOPEr will guide you:",
    key="user_query",
    height=TEXT_INPUT_HEIGHT,
)
go = st.button("Ask")

def openai_fallback_answer(q: str) -> str:
    """Plain LLM answer (no retrieval context)."""
    system_fallback = (
        "You are a helpful assistant. Answer the user's question clearly and completely."
    )
    fallback_prompt = ChatPromptTemplate.from_messages([
        ("system", system_fallback),
        ("human", "{q}"),
    ])
    messages = fallback_prompt.format_messages(q=q)
    return llm.invoke(messages).content

if go and query.strip():
    with st.spinner("Thinking…"):
        used_fallback = False
        answer = ""
        context_docs = []

        try:
            # 1) Try RAG
            rag_resp = rag_chain.invoke({"input": query})
            # LangChain can return 'answer' or 'result'
            answer = (rag_resp.get("answer") or rag_resp.get("result") or "").strip()
            context_docs = rag_resp.get("context", []) or []
        except Exception as e:
            # Any RAG error -> fallback
            used_fallback = True
            answer = openai_fallback_answer(query)

        # 2) Heuristic fallback if RAG outcome is weak
        if not used_fallback and needs_fallback(answer, context_docs):
            used_fallback = True
            answer = openai_fallback_answer(query)

    # Output
    st.subheader("Answer")
    if not used_fallback:
        st.markdown("**🔎 RAG**")
    st.write(answer)

    # Sources (only for RAG path)
    if not used_fallback and context_docs:
        with st.expander("Show sources (top chunks)"):
            for i, doc in enumerate(context_docs, 1):
                meta = getattr(doc, "metadata", {}) or {}
                src = meta.get("source") or meta.get("file_path") or "Unknown source"
                st.markdown(f"**Source {i}:** {src}")
                content = getattr(doc, "page_content", "") or ""
                if content:
                    st.caption(content[:1200] + ("…" if len(content) > 1200 else ""))

    # Debug/tips
    st.caption(
        "Tip: If you see frequent OpenAI fallbacks, consider adding more documents, "
        "increasing top-k, or adjusting chunk sizes."
    )
