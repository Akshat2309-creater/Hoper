# HOPEr — What the app offers (current behavior)

This document describes the main parts of the HOPEr web app **as it works today**, after the recent updates. It is meant for teammates, testers, or anyone onboarding to the project.

---

## Big picture

**HOPEr** is a mental-wellness companion experience: a calm website where people can read about the project, run short check-ins, try mindfulness and sleep tools, and **chat** with an AI assistant that is grounded in your curated knowledge (via the backend RAG pipeline).

Most of the site is **only available after sign-in**, so the experience stays behind a simple access gate suitable for a small pilot team.

---

## Sign-in and access

- **Login screen (`/login`)** appears before the home page and other app routes.
- **Who can sign in:** the app is set up for a **single authorized operator account** (email + password configured in the project). Other emails cannot complete sign-in or registration.
- **Ways to sign in:**
  - **Email + password** (including a “sign in with password” path without the email code step).
  - **Email verification code** (pilot-style: the code is for local testing when real email delivery is not wired up).
  - **Google** (optional): only appears if you configure `VITE_GOOGLE_CLIENT_ID` in `src/.env` and restart the dev server.
- **Session:** after a successful login, a **session** is stored in the browser (`localStorage`). Closing the tab does not always log you out; use **Sign out** when you are done on a shared device.
- **Logout:** clears the session from this browser.

---

## Protected routes

Everything except **`/login`** is wrapped in a **protected route**: if you are not signed in, you are redirected to the login page. That includes the home page, chat, quizzes, mindfulness, sleep, throwbacks, FAQ, and learn-more.

---

## Home page (`/`)

The landing experience introduces HOPEr, highlights objectives and how the approach works, and links visitors into the main tools (for example **Get Started** → chat). Content respects the **language** and **light/dark theme** you have chosen.

---

## Chat with HOPEr (`/chat`)

- A full-screen style **conversation** with HOPEr.
- Messages are sent to your **FastAPI backend** (the `/chat` endpoint). In development the API URL defaults to `http://localhost:8000` unless you override it.
- **Production / deployment:** set **`VITE_API_BASE_URL`** in the frontend environment to your deployed API base URL (no trailing slash), then rebuild the site, so the browser calls your real server instead of localhost.
- The chat UI can show **context from other wellness flows** when you arrive from those areas (so HOPEr can respond with continuity).
- **Conversation starters** help users begin when they are not sure what to type.

---

## Mood check-in (`/mood-check`)

A short **mood quiz** flow that produces a friendly snapshot and suggestions. It can deep-link into chat with a starter message when the user wants to talk more.

---

## Assessment (`/assessment`)

A slightly longer **check-in** (mood, sleep, calm, energy, and what the user feels they need). Results are summarized in a supportive way and offer **next steps** (for example sleep or mindfulness modes, or chat).

---

## Mindfulness (`/mindfulness`)

Guided experiences such as **breathing** and related practices. URLs can open a specific mode (for example breathing) when linked from elsewhere in the app.

---

## Sleep (`/sleep`)

A **sleep wellness** flow (day vs night tone, steps, optional diary-style prompts, and related UI). Like mindfulness, it can be opened with URL parameters so other parts of the app can send people straight into a helpful step.

---

## Throwbacks (`/throwbacks`)

A simple **timeline-style recap** of things this signed-in user has done in the app that we log locally—for example chat prompts they sent (short summaries) and sign-in events. It reads from **per-user activity** stored in the browser. It is a “memory lane” for the pilot operator, not a clinical record.

---

## Account menu (navbar)

When signed in, the navbar shows an **avatar with initials**, a short profile summary, links to **Throwbacks**, and **Sign out**.

---

## Navbar and navigation

- **Explore** menu: quick routes to quiz, mindfulness, sleep, FAQ, etc.
- **Chat** in the navbar opens the **in-app** HOPEr chat (`/chat`), not an external page.
- **Language** globe: switches UI strings among supported languages (with English fallback where a translation is missing).
- **Theme toggle:** light or dark mode; preference is remembered for this browser.

---

## Learn more & FAQ

- **`/learn-more`** — deeper context about the project and approach.
- **`/faq`** — common questions in a readable FAQ layout.

Both are behind sign-in like the rest of the app.

---

## Configuration reference (high level)

| Item | Purpose |
|------|--------|
| `VITE_API_BASE_URL` | Where the frontend sends **chat** requests in production (HTTPS API recommended). |
| `VITE_GOOGLE_CLIENT_ID` | Optional; enables the Google button on the login screen. |
| Backend `.env` | API keys and services for **FastAPI** (e.g. OpenAI, Pinecone)—never commit real secrets; keep them on the server only. |

See `src/.env.example` for frontend variable names.

---

## What this document does *not* cover

- Clinical or legal claims beyond what the product UI states.
- Backend indexing, PDF ingestion, or ops runbooks (those live with the API and deployment setup).

If something here drifts from the code, treat the repository as the source of truth and update this file when behavior changes.
