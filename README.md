# MediCare AI

MediCare AI is a personal health assistant web application. It lets users track vitals, log medications and symptoms, maintain a basic health profile, and chat with an AI assistant (powered by Google's Gemini API) for general health information. The app is not a substitute for professional medical advice — the AI assistant always includes an informational-use disclaimer.

## Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS
- Lucide React (icons)
- React Router DOM

**Backend**
- Python + FastAPI
- SQLAlchemy (ORM)
- SQLite (database)
- Google Generative AI SDK (Gemini API)

## Project Structure

```
medicare-ai/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── requirements.txt
│   ├── .env
│   ├── routes/
│   │   ├── ai_assistant.py
│   │   ├── patients.py
│   │   └── vitals.py
│   └── services/
│       └── llm_service.py
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── .env
```

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- A Gemini API key ([Google AI Studio](https://aistudio.google.com/app/apikey))

## Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv

   # macOS/Linux
   source venv/bin/activate

   # Windows
   venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables — copy `.env.example` (or edit `.env` directly) and set:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   DATABASE_URL=sqlite:///./medicare.db
   ```

5. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

   The API will be available at `http://localhost:8000`, with interactive docs at `http://localhost:8000/docs`. Database tables are created automatically on startup.

## Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   VITE_API_URL=http://localhost:8000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

## Running Both Servers

Run the backend and frontend in two separate terminal windows/tabs (backend first, so the API is ready when the frontend loads):

```bash
# Terminal 1
cd backend && uvicorn main:app --reload

# Terminal 2
cd frontend && npm run dev
```

Then open `http://localhost:5173` in your browser.

## Disclaimer

MediCare AI's AI Assistant provides general informational content only and is not a substitute for professional medical diagnosis, advice, or treatment. Always consult a qualified healthcare provider for medical concerns.