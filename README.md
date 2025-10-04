# CineLenz — Real-time cinema insights

Team Members: Your Name (dev), Teammate (ml)

Elevator Pitch
CineLenz analyzes public conversations to surface real-time sentiment, themes, and moments that resonate for films and events.

Live Demo
- URL / IP: http://203.0.113.12:3000
- Endpoints: see deployment/ENDPOINTS.md

Quick Start (Local)
1. Frontend (Next.js): open v0 preview or run locally.
2. Backend (FastAPI):
   - Copy .env.example to .env if needed
   - Docker (recommended): see deployment/Dockerfile.fastapi
   - Or run scripts/start_fastapi.py

Tests
- Placeholder tests in tests/

Environment Variables
- API_BASE — base URL for FastAPI (e.g., http://localhost:8000)

Known Limitations
- Frontend wired to form; analysis endpoint is scaffolded and returns mock data.

License
MIT
