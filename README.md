# 💫 HOPEr – Mental Health Support Platform

HOPEr is an AI-powered mental health companion designed to provide **emotional support, awareness, and guidance** through empathetic conversations.  
It helps students and individuals manage **stress, anxiety, burnout, and emotional imbalance** by combining human-like understanding with smart, data-driven insights.

---

## 🧠 About the Project

HOPEr acts as a **virtual mental wellness assistant**, empowering users to track their mood, express emotions freely, and receive tailored suggestions and responses — all while ensuring privacy and authenticity.  
It uses **LangChain**, **FastAPI**, and **Pinecone Vector Databases** to retrieve meaningful, evidence-based content in real time and present it through an intuitive, calming interface.

📄 **Presentation:** [View Google Slides](https://docs.google.com/presentation/d/1EU21qgEkFCaWVA2_XrjrfKBD-Rxx9M5FrGIt6cTblyg/edit?usp=sharing)

---

## 💡 The Problem It Solves

Mental health issues like **stress, depression, and anxiety** are increasing rapidly among youth, but access to professional help remains limited due to:

- Lack of awareness and stigma surrounding mental health.
- Limited availability of affordable, immediate counseling support.
- Hesitation to open up or seek help in person.
- Overload of information online without credible guidance.

💛 **HOPEr bridges this gap** by offering:

- A **non-judgmental AI companion** that listens and responds empathetically.
- **24×7 personalized guidance** powered by verified knowledge bases.
- A safe space for individuals to **self-assess and express emotions** privately.
- Real-time **AI-assisted responses** to provide comfort and clarity.

---

## 🧭 Use Cases

| Scenario                                  | How HOPEr Helps                                                                     |
| ----------------------------------------- | ----------------------------------------------------------------------------------- |
| **Student facing academic stress**        | Provides motivational and mindful coping suggestions through chat.                  |
| **Someone feeling anxious or isolated**   | Engages empathetically using emotional tone detection and supportive prompts.       |
| **Users seeking self-awareness**          | Guides users through the “Know Your Mood” quiz to understand their emotional state. |
| **Therapy support companion**             | Acts as a non-replacement but effective first step before professional help.        |
| **Corporate or institutional deployment** | Can be integrated for employees or students to encourage mental wellness check-ins. |

---

## ⚙️ System Architecture

**PDF → Text Extraction → Chunking → Embeddings → Pinecone DB  
User Query → FastAPI → Pinecone → Retrieve Context → OpenAI LLM → Response → Frontend**

This architecture ensures that every user query is **contextually mapped**, **semantically understood**, and **emotionally aligned** before being presented as a helpful response.

---

## 🚀 Core Technologies

| Stack              | Description                                                              |
| ------------------ | ------------------------------------------------------------------------ |
| **Frontend**       | ReactJS + TailwindCSS for smooth, responsive, and calming user interface |
| **Backend**        | Python (FastAPI) for efficient data handling and AI pipeline integration |
| **AI Integration** | LangChain + OpenAI GPT for intelligent, empathetic conversations         |
| **Database**       | Pinecone Vector Database for semantic retrieval and contextual matching  |
| **Knowledge Base** | Extracted and processed from verified mental health PDFs and resources   |

---

## 👩‍💻 Team Members

| Name               | Role                                        | Description                                                                                                                                                                       |
| ------------------ | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Anmol Pandey**   | _Frontend Developer_                        | Leads frontend development using ReactJS and Tailwind. Designs and implements intuitive UI components for chat, quizzes, and navigation ensuring smooth, responsive interactions. |
| **Akshat Verma**   | _Backend Developer_                         | Builds and manages the FastAPI backend, connecting LangChain modules with Pinecone and OpenAI APIs. Ensures fast, reliable, and secure response handling between AI and frontend. |
| **Jiraj Pandey**   | _UI/UX Designer_                            | Designs emotionally engaging and user-friendly layouts with focus on mental calmness. Shapes color palette, typography, and interactive flows aligned with user empathy.          |
| **Shalini Pandey** | _Data Extraction & Knowledge Base Engineer_ | Handles PDF data extraction, chunking, and embedding generation for the knowledge base. Ensures high-quality, relevant, and contextual information storage in Pinecone.           |

---

## 🌈 Key Features

- 🧭 **Mood Check-in:** “Know Your Mood” quiz with adaptive results.
- 💬 **Empathetic Chatbot:** Emotion-aware AI assistant using LangChain + GPT.
- 🧩 **RAG Pipeline:** Retrieves the most relevant, verified knowledge from vector databases.
- 🎨 **Calming UI/UX:** Designed for comfort and focus during emotional stress.
- 🔒 **Secure & Private:** No personal data collection — conversations stay confidential.

---

## ⚡ Usage Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/04anmol/codeScarab_hackCBS8.0
   cd hoper_hackcbs8-main
   ```
2. **Install dependencies:**
   ```bash
   npm install
   npm run dev
   ```
3. **streamlit run "Practice Set for Langchain/Hoper/pdfstuff.py"**

## 🌍 Impact

- Promotes **mental wellness and emotional awareness** among youth.
- Offers an **AI-driven safe space** for individuals to express emotions.
- Encourages **early-stage intervention** and self-reflection.
- Bridges the gap between **technology and empathy** for societal good.

## 🧩 Future Enhancements

- 🎯 Integration of **sentiment-based voice responses** for enhanced interaction.
- 🧘 Addition of **guided breathing and relaxation modules**.
- 🩵 Building a **community support forum** for peer-to-peer empathy.
- 🌐 Multilingual support for broader accessibility.

## 💎 Why HOPEr?

- Combines **Retrieval-Augmented Generation (RAG)** with **empathetic NLP**.
- Simple, secure, and user-friendly design for mental health support.
- Built with **purpose, empathy, and precision** — not just technology.
- Designed to **listen first**, then respond with compassion.

**💛 “Your mental health matters — You are not alone.”**
