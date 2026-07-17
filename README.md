# ViralGen AI

A multi-modal marketing content generation tool. Enter a brief, pick a brand voice and platform, and get back platform-formatted marketing copy + a generated image + a composited final asset.

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js + TypeScript + Tailwind | UI |
| Backend | FastAPI | REST API |
| LLM | Groq (Llama 3.1) | Copy generation + prompt refinement |
| Image Gen | Pollinations AI | Image generation |
| Image Processing | Pillow (PIL) | Text overlay compositing |
| Task Queue | Celery | Async background processing |
| Message Broker | Redis | Task dispatch and result storage |
| Database | MongoDB Atlas | Generation history |
| Containerization | Docker Compose | Service orchestration |

## Architecture

```
User → Next.js Frontend
           ↓
       FastAPI Backend
           ↓
    ┌──────┴──────┐
  Groq LLM    Pollinations AI
  (copy +      (image
  refiner)     generation)
           ↓
       Celery Worker (async)
           ↓
         Redis (broker)
           ↓
       Pillow (compositor)
           ↓
    MongoDB Atlas (history)
```

## Setup

### Prerequisites
- Docker Desktop with WSL2
- Node.js 18+
- Git

### Installation

1. Clone the repo
```bash
git clone https://github.com/vidit-141/viralgen-ai.git
cd viralgen-ai
```

2. Set up environment variables
```bash
cp .env.example .env
```

Fill in `.env`:
```
GROQ_API_KEY=your_groq_key
HUGGINGFACE_API_KEY=your_hf_key
MONGODB_URI=your_atlas_uri
REDIS_URL=redis://redis:6379/0
```

3. Start the backend
```bash
docker compose up --build
```

4. Start the frontend
```bash
cd frontend
npm install
npm run dev
```

5. Open `http://localhost:3000`

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Service status |
| POST | `/generate/copy` | Generate copy only |
| POST | `/refine/prompt` | Refine brief into image prompt |
| POST | `/generate/image` | Generate image only |
| POST | `/generate/asset` | Full sync pipeline |
| POST | `/generate/asset/async` | Full async pipeline, returns job_id |
| GET | `/task/{id}/status` | Poll task progress |
| GET | `/history/` | Fetch generation history |
| POST | `/regenerate/copy` | Regenerate copy with new persona |

## Key Features

- **Prompt Refinement Agent** — invisible layer that rewrites vague briefs into detailed image prompts
- **4 Brand Personas** — Professional, Witty, Urgent, Playful with distinct system prompts
- **3 Platform Templates** — LinkedIn, Instagram, Twitter with format-specific instructions
- **Async Generation** — job ID returned instantly, heavy work runs in background worker
- **Live Progress** — frontend polls every 2s with step messages and progress percentage
- **Image Compositing** — Pillow overlays copy onto generated image with persona-styled banners
- **Generation History** — MongoDB Atlas stores all assets, browsable from sidebar
- **Security** — rate limiting, prompt injection guard, security headers, input sanitization

## Project Structure

```
viralgen-ai/
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI route handlers
│   │   ├── services/     # Business logic
│   │   ├── celery_app.py # Celery configuration
│   │   ├── config.py     # Settings
│   │   ├── database.py   # MongoDB connection
│   │   ├── personas.py   # Brand persona configs
│   │   ├── tasks.py      # Celery tasks
│   │   └── utils.py      # Sanitization helpers
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   ├── hooks/            # Custom hooks
│   ├── lib/              # API client
│   └── Dockerfile
├── docker-compose.yml
└── docker-compose.prod.yml
```

## Security

- Rate limiting on all generation endpoints (10 req/min)
- Prompt injection detection with regex pattern matching
- CORS restricted to localhost:3000
- Security headers (X-Frame-Options, X-XSS-Protection, nosniff)
- Structured error responses — no raw tracebacks exposed
- Input sanitization and strict Pydantic validation

## Load Testing

5 concurrent requests processed successfully with an average completion time of 8 seconds using the async Celery queue architecture.