# CineLenz — See Cinema Through the Social Lens

Team Members:
- Austin Chen (Full Stack Developer) 
- Allen p jison (UI/UX Designer)
- Adithyan cp (Backend Developer)

## Elevator Pitch
CineLenz analyzes social media conversations about movies in real-time, providing sentiment analysis, trending topics, and audience insights through an intuitive visual interface.

## Live Demo
- URL / IP: http://202.88.252.51:3004
- Endpoints: see `deployment/ENDPOINTS.md`

By submitting this project, we consent to event organizers and judges accessing the listed local endpoints while connected to the event Wi-Fi for evaluation purposes. We understand that organizers will not access private customer data and will only use provided credentials.

## Quick Start (Local)

1. Clone repo
```bash
git clone https://github.com/LyfSeeker/cinelenz.git
cd cinelenz
```

2. Create .env from .env.example and set required variables.

3. Install dependencies and start frontend:
```bash
npm install
npm run dev
```

4. Start the backend API server:
```bash
cd src/backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

5. Open http://localhost:3000

## Tests
```bash
npm install
npm test
```

## Environment Variables
- `NEXT_PUBLIC_API_URL` — API server URL (default: http://localhost:8000)
- `TMDB_API_KEY` — The Movie Database API key
- `PORT` — Frontend port (default: 3000)

## Known Limitations
- Social media analysis uses simulated data due to API restrictions
- Performance may degrade with high traffic
- Movie trailers require a selected movie to display

## License
MIT
npm run dev
```

### 4. Optional Backend Setup

- Navigate to the backend folder (for example, `backend` or `scripts/backend`)
- Install Python dependencies from `requirements.txt`
- Start Flask or FastAPI server

```bash
pip install -r requirements.txt
python app.py
```

---

## ⚙️ Folder Structure

- app — Next.js app pages
- components — Reusable React components
- hooks — Custom React hooks
- lib — Utilities and API helpers
- scripts/backend — Backend (Flask/FastAPI) code
- public — Static assets
- styles — Global styles
- tests — Unit and integration tests

---

## 🌐 API Integration

- Frontend sends movie search requests to backend `/api/search`
- Backend fetches and processes posts using snscrape and PRAW
- Sentiment and clustering via multilingual models
- Returns threads, sentiment, and timeline data in JSON

---

## 📄 License

MIT

---

## 🤝 Contributing

PRs, issues, and feedback welcome  
See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 🙋‍♂️ Team and Credits

Built by [Your Name or team] for [Hackathon Name]  
Powered by open source libraries and APIs

---
