from fastapi import FastAPI
from pydantic import BaseModel
from typing import Literal, Optional

app = FastAPI(title="CineLenz API")

# Allow local frontend calls; tighten for production as needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Range = Literal["24h", "week", "month"]
Lang = Literal["en", "hi", "ta", "te", "es"]

class AnalyzeRequest(BaseModel):
    movie: str
    time_range: Range
    language: Optional[Lang] = "en"

class AnalyzeResponse(BaseModel):
    ok: bool
    summary: str
    threads: int
    sample_topics: list[str]

class TrendingResponse(BaseModel):
    movies: list[str]

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/trending", response_model=TrendingResponse)
def trending(lang: Lang = "en"):
    catalog = {
        "en": ["Dune: Part Two", "Oppenheimer", "Barbie", "Joker: Folie à Deux", "The Batman"],
        "hi": ["Jawan", "Pathaan", "Animal", "Gadar 2", "Dunki"],
        "ta": ["Leo", "Jailer", "Vikram", "Master", "Ponniyin Selvan"],
        "te": ["RRR", "Salaar", "Pushpa 2", "Devara", "Arjun Reddy"],
        "es": ["La Sociedad de la Nieve", "Roma", "Dolor y Gloria", "Contratiempo", "Relatos Salvajes"],
    }
    return TrendingResponse(movies=catalog.get(lang, catalog["en"]))

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    return AnalyzeResponse(
        ok=True,
        summary=f"Mock analysis for '{req.movie}' over {req.time_range} ({req.language}).",
        threads=42,
        sample_topics=["buzz", "box office", "performances"],
    )
