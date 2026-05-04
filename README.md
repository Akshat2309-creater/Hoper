# HOPEr - An AI Companion for Mental Well-being

<div align="center">

**Submitted by**

Akshat R. Tripathi (2204921530010)  
Akshat Verma (2204921530011)  
Anmol Pandey (2204921530023)  
Abhay Pratap Singh Shakya (2204921530002)

**Under Supervision of**  
**Ms. Pragati Upadhyay**

**Department of Computer Science and Engineering**  
**KCC Institute of Technology and Management**  
**Dr. A. P. J. Abdul Kalam Technical University, Lucknow**

**May, 2026**

</div>

---

This repository contains the complete codebase for HOPEr, an AI-powered mental health companion platform.

## Overview

HOPEr is an AI-powered mental health companion designed to provide emotional support, awareness, and guidance through empathetic conversations. It helps students and individuals manage stress, anxiety, burnout, and emotional imbalance by combining human-like understanding with smart, data-driven insights.

The platform acts as a virtual mental wellness assistant, empowering users to track their mood, express emotions freely, and receive tailored suggestions and responses — all while ensuring privacy and authenticity. It uses LangChain, FastAPI, and Pinecone Vector Databases to retrieve meaningful, evidence-based content in real time and present it through an intuitive, calming interface.

**Presentation:** [View Google Slides](https://docs.google.com/presentation/d/1Hv-E81I20iZz368yORsaNkeWFaXYYuOE/edit?usp=sharing&ouid=116054875621763352488&rtpof=true&sd=true)

**Live Demo:** [https://hoper.chat/](https://hoper.chat/)

## Problem Statement

Mental health issues like stress, depression, and anxiety are increasing rapidly among youth, but access to professional help remains limited due to:

- Lack of awareness and stigma surrounding mental health.
- Limited availability of affordable, immediate counseling support.
- Hesitation to open up or seek help in person.
- Overload of information online without credible guidance.

HOPEr bridges this gap by offering:

- A non-judgmental AI companion that listens and responds empathetically.
- 24×7 personalized guidance powered by verified knowledge bases.
- A safe space for individuals to self-assess and express emotions privately.
- Real-time AI-assisted responses to provide comfort and clarity.

## Use Cases

| Scenario                                  | How HOPEr Helps                                                                     |
| ----------------------------------------- | ----------------------------------------------------------------------------------- |
| **Student facing academic stress**        | Provides motivational and mindful coping suggestions through chat.                  |
| **Someone feeling anxious or isolated**   | Engages empathetically using emotional tone detection and supportive prompts.       |
| **Users seeking self-awareness**          | Guides users through the "Know Your Mood" quiz to understand their emotional state. |
| **Therapy support companion**             | Acts as a non-replacement but effective first step before professional help.        |
| **Corporate or institutional deployment** | Can be integrated for employees or students to encourage mental wellness check-ins. |

## System Architecture

**PDF → Text Extraction → Chunking → Embeddings → Pinecone DB  
User Query → FastAPI → Pinecone → Retrieve Context → OpenAI LLM → Response → Frontend**

This architecture ensures that every user query is contextually mapped, semantically understood, and emotionally aligned before being presented as a helpful response.

## Core Technologies

| Stack              | Description                                                              |
| ------------------ | ------------------------------------------------------------------------ |
| **Frontend**       | ReactJS + TailwindCSS for smooth, responsive, and calming user interface |
| **Backend**        | Python (FastAPI) for efficient data handling and AI pipeline integration |
| **AI Integration** | LangChain + OpenAI GPT for intelligent, empathetic conversations         |
| **Database**       | Pinecone Vector Database for semantic retrieval and contextual matching  |
| **Knowledge Base** | Extracted and processed from verified mental health PDFs and resources   |

## Key Features

- **Mood Check-in:** "Know Your Mood" quiz with adaptive results.
- **Empathetic Chatbot:** Emotion-aware AI assistant using LangChain + GPT.
- **RAG Pipeline:** Retrieves the most relevant, verified knowledge from vector databases.
- **Calming UI/UX:** Designed for comfort and focus during emotional stress.
- **Secure & Private:** No personal data collection — conversations stay confidential.

## Setup and Installation

This guide is for setting up HOPEr locally for development or evaluation.

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+ (3.11/3.12 recommended)
- Git

### Cloning the Repository

```bash
git clone https://github.com/Akshat2309-creater/Hoper
cd Hoper
```

### Repository Structure

- Frontend app: `src`
- Backend API: `backend`

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:

   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install dependencies:

   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   pip install python-multipart
   ```

4. Create environment file:
   Create `backend/.env` with the required keys (obtain from project administrator):

   ```
   OPENAI_API_KEY="your_openai_api_key"
   PINECONE_API_KEY="your_pinecone_api_key"
   ```

5. Start the backend server:

   ```bash
   uvicorn api:app --host 0.0.0.0 --port 8000 --reload
   ```

6. Verify backend is running:
   - Visit [http://localhost:8000/health](http://localhost:8000/health)
   - Expected response: `{"status":"healthy"}`

### Frontend Setup

1. In a new terminal, navigate to the frontend directory:

   ```bash
   cd src
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. For production deployment, create `src/.env` from `src/.env.example` and set:
   ```
   VITE_API_BASE_URL=https://your-backend-domain
   ```
   Note: For HTTPS frontend, the backend must also be HTTPS to avoid mixed-content errors.

### Quick Start

Terminal 1 (Backend):

```bash
cd backend
python -m venv venv
# Activate venv as above
pip install -r requirements.txt
pip install python-multipart
# Create .env with API keys
uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```

Terminal 2 (Frontend):

```bash
cd src
npm install
npm run dev
```

## Troubleshooting

### Backend Issues

- **Error loading ASGI app / Could not import module "api"**
  - Ensure running from `backend` directory.
  - Check Python dependencies are installed.
  - Verify `backend/.env` exists with required keys.
  - Test import: `python -c "import api; print('api import ok')"`

### Frontend Issues

- **Chat loads but no assistant response**
  - Confirm backend is running and accessible.
  - Check `VITE_API_BASE_URL` points to correct backend URL.
  - Ensure backend URL is HTTPS in production.

## Deployment Checklist

- Backend secrets provisioned securely (OPENAI_API_KEY, PINECONE_API_KEY).
- Frontend environment set (VITE_API_BASE_URL to HTTPS backend).
- Backend exposes /health and /chat endpoints.
- CORS/network policy allows frontend to call backend.
- No secrets committed in Git history.

## Impact

- Promotes mental wellness and emotional awareness among youth.
- Offers an AI-driven safe space for individuals to express emotions.
- Encourages early-stage intervention and self-reflection.
- Bridges the gap between technology and empathy for societal good.

## Future Enhancements

- Integration of sentiment-based voice responses.
- Guided breathing and relaxation modules.
- Community support forum for peer-to-peer empathy.
- Multilingual support for broader accessibility.

## Why HOPEr?

- Combines Retrieval-Augmented Generation (RAG) with empathetic NLP.
- Simple, secure, and user-friendly design for mental health support.
- Built with purpose, empathy, and precision — not just technology.
- Designed to listen first, then respond with compassion.

"Your mental health matters — You are not alone."

---

This project is developed as part of a final year academic submission. For any queries, refer to the team members listed above.
