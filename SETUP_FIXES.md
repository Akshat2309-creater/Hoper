# HOPEr Setup & Troubleshooting Guide

If you just cloned the repository (before Checkpoint v1.0), follow these exact steps to fix pathing, backend DLL crashes, and Windows terminal encoding issues.

---

## 1. Frontend Fixes (Vite Paths)

By default, Vite was misconfigured for paths since the project files were moved.

1. **Open `src/index.html`**:
   - Find: `<script type="module" src="/src/main.tsx"></script>`
   - Change to: `<script type="module" src="/main.tsx"></script>`
2. **Open `src/vite.config.ts`**:
   - Find: `"@": path.resolve(__dirname, "./src")`
   - Change to: `"@": path.resolve(__dirname, "./")`

---

## 2. Backend Fixes (PyTorch / DLL & Encoding Crashes)

The backend original code used HuggingFace PyTorch embeddings which causes DLL initialization crashes (`[WinError 1114]`) on some Windows machines. It also had Emojis that caused `UnicodeEncodeError`.

1. **Remove PyTorch/HuggingFace dependencies** (to avoid the DLL crash):
   - Open `backend/__pycache__/Practice Set for Langchain/Hoper/api.py`.
   - Replace the `HuggingFaceEmbeddings` import:
     ```python
     # Replace: from langchain_huggingface import HuggingFaceEmbeddings
     from langchain_openai import OpenAIEmbeddings
     ```
   - Update the Embeddings Config:
     ```python
     INDEX_NAME = "hoperbot-openai"
     EMBED_MODEL = "text-embedding-3-small"
     EMBED_DIM = 1536
     ```
   - Update the `get_embeddings()` function:
     ```python
     def get_embeddings():
         return OpenAIEmbeddings(model=EMBED_MODEL)
     ```

2. **Fix Windows Unicode Crash**:
   - In `api.py`, remove emojis from all `print()` statements (e.g., `✅`, `❌`, `🔑`). Windows cmd/powershell (cp1252) crashes when trying to print these.

3. **Install Missing Dependencies**:
   - Create your virtual environment and install standard requirements, then install the missing missing gRPC tools:
     ```powershell
     pip install googleapis-common-protos protobuf grpcio
     ```

---

## 3. Environment Variables

The backend needs API keys to use OpenAI LLM + Embeddings and Pinecone Vector DB.

1. Create a `.env` file **one folder exactly above** `api.py` (which is `Practice Set for Langchain/`).
2. Add your keys:
   ```env
   OPENAI_API_KEY="sk-..."
   PINECONE_API_KEY="pcsk_..."
   ```

---

## 4. How to Run

You need two terminals.

**Terminal 1 (Backend)**:
```powershell
cd backend
.\venv\Scripts\activate
uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 (Frontend)**:
```powershell
cd src
npm install
npm run dev
```
