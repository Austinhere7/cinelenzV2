# CineLenz 🎬

See Cinema Through the Social Lens — Real time threads, sentiment, and trends for movies and events.

---

## 🚀 Overview

**CineLenz** is a hackathon ready project that detects and visualizes social media conversations related to movies or cinematic events.  
Powered by NLP and sentiment analysis, CineLenz groups posts into threads, identifies trending topics, and shows how audience buzz evolves across platforms like X (Twitter) and Reddit.

---

## ✨ Features

- **Thread Detection:** Groups related posts into conversation clusters using NLP and metadata.
- **Sentiment and Emotion Analysis:** Detects audience tone (positive, negative, neutral) using multilingual models.
- **Timeline Visualization:** Shows how movie buzz grows and fades over time.
- **Trending Now:** Surfaces hot topics and movies discussed in the last 24h, week, or month.
- **Search Any Movie:** Explore live or recent threads and sentiment for any movie or event.

---

## 🧩 Tech Stack

- **Frontend:** React.js, TailwindCSS, Chart.js
- **Backend:** Flask or FastAPI (Python)
- **NLP:** Sentence Transformers for thread clustering, Multilingual Sentiment Models from HuggingFace
- **Data Collection:** snscrape for X/Twitter, PRAW for Reddit
- **Visualization:** Chart.js, D3.js, Recharts

---

## 🛠️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/<your-username>/cinelenz.git
cd cinelenz
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Start the Frontend

```bash
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
