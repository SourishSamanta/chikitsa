# Chikitsa — Dadi Maa Ke Nuskhe & RAG AI Assistant

Chikitsa is a React Native (Expo) home-remedies app paired with a Node.js + Express RAG (Retrieval-Augmented Generation) backend powered by Google Gemini.

## Project Structure

```text
chikitsa/
├── app/                     # React Native (Expo) mobile & web app
│   ├── src/
│   │   ├── components/      # ChatBubble, RemedyCard, DailyTipCard, etc.
│   │   ├── data/            # Remedies, tips, and offline fallback knowledge
│   │   ├── screens/         # ChatScreen, RemediesScreen, TipsScreen, SavedScreen
│   │   ├── services/        # ragService.js (connects app to RAG backend)
│   │   └── theme/           # Colors and design tokens
│   └── .env.example         # EXPO_PUBLIC_API_URL config
│
└── server/                  # Node.js + Express RAG backend
    ├── knowledge/           # Drop .csv, .txt, .md, .docx, .doc files here
    │   ├── remedies.csv     # Grandma's remedies (rem-1..rem-8)
    │   └── knowledge.csv    # Daily Ayurvedic tips & ingredient spotlights
    ├── data/                # Generated vectorStore.json (auto-created on ingest)
    ├── src/
    │   ├── config.js        # Env & model configuration
    │   ├── index.js         # Express entry point
    │   ├── rag/             # fileParser, embeddings, vectorStore, retriever, safety, generator
    │   ├── routes/          # POST /api/chat & POST /api/reindex
    │   └── scripts/         # ingest.js & testRag.js
    └── .env.example         # GEMINI_API_KEY and model settings
```

---

## 1. Backend Setup (`server/`)

### Prerequisites
- Node.js 18+ (tested on Node 24)
- A Google Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### Steps
```bash
cd server
npm install
```

Create `server/.env` (copy from `server/.env.example`) and add your key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key
PORT=3001
GEMINI_CHAT_MODEL=gemini-3.8-flash
GEMINI_FALLBACK_MODEL=gemini-3.5-flash-lite
GEMINI_EMBEDDING_MODEL=gemini-embedding-001
EMBEDDING_DIMENSIONS=768
RAG_TOP_K=4
RAG_MIN_SCORE=0.52
```

### Build the Vector Store (Ingest Knowledge Files)
```bash
npm run ingest
```
This reads every `.csv`, `.txt`, `.md`, `.docx`, and `.doc` file inside `server/knowledge/`, generates Gemini embeddings, and saves them to `server/data/vectorStore.json`.

### Start the Server
```bash
npm run dev      # auto-restarts on file changes
# or
npm start
```

### Verify / Test the RAG Pipeline
```bash
npm run test:rag
```

### API Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Server status, active models, and loaded vector store stats |
| `POST` | `/api/chat` | Body: `{ "query": "...", "history": [...] }` → returns grounded Dadi Maa reply, `remedyId`, `safetyAlert`, and `sources` |
| `POST` | `/api/reindex` | Re-scans `server/knowledge/` and rebuilds embeddings live without restarting |

### Adding More Remedies or Documents
1. Edit `server/knowledge/remedies.csv` or `server/knowledge/knowledge.csv`, **or** drop any new `.csv`, `.txt`, `.md`, `.docx`, or `.doc` file into `server/knowledge/`.
2. Re-index by running `npm run ingest` (or calling `POST http://localhost:3001/api/reindex` while the server is running).

---

## 2. Mobile & Web App Setup (`app/`)

### Install & Run
```bash
cd app
npm install
npm start
```
Then press `a` (Android emulator), `i` (iOS simulator), or `w` (Web), or scan the QR code with Expo Go.

### Connecting the App to the Backend
By default, `app/src/services/ragService.js` picks:
- **Web / iOS Simulator:** `http://localhost:3001`
- **Android Emulator:** `http://10.0.2.2:3001`

**Testing on a physical phone (Expo Go):**
1. Make sure your phone and PC are on the same Wi-Fi network.
2. Find your PC's local IPv4 address (e.g., run `ipconfig` on Windows → `192.168.x.x`).
3. Create `app/.env` (copy from `app/.env.example`):
   ```env
   EXPO_PUBLIC_API_URL=http://192.168.x.x:3001
   ```
4. Restart Expo (`npx expo start -c`).

> **Offline Fallback:** If the RAG server isn't running or is unreachable, `ChatScreen` automatically falls back to the local keyword matcher in `app/src/data/botKnowledge.js` so the app stays usable.

---

## Safety Note
Chikitsa provides traditional Indian home remedies for everyday mild discomfort only and is not a substitute for professional medical advice. The RAG pipeline includes deterministic red-flag detection for urgent emergency symptoms as well as grounded precaution reminders from your knowledge base.
