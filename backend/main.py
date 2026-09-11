from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from analyzer import analyze
from scraper import scrape, ScrapeError


app = FastAPI(title="Redline Analyzer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    type: str         # "url" or "text"
    content: str


class AnalyzeResponse(BaseModel):
    scores: Dict[str, int]
    verdict: Dict[str, Any]
    signals: List[Dict[str, Any]]
    claims: List[Dict[str, Any]]
    meta: Dict[str, Any]


@app.get("/")
def root():
    return {"status": "ok", "service": "redline-analyzer"}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze_endpoint(req: AnalyzeRequest):
    mode = (req.type or "").lower().strip()
    content = (req.content or "").strip()

    if mode not in ("url", "text"):
        raise HTTPException(status_code=400, detail="type must be 'url' or 'text'.")

    if not content:
        raise HTTPException(status_code=400, detail="content is empty.")

    if mode == "url":
        try:
            fetched = scrape(content)
        except ScrapeError as e:
            raise HTTPException(status_code=422, detail=str(e))
        except Exception:
            raise HTTPException(
                status_code=500,
                detail="Unexpected error while fetching that URL."
            )
        result = analyze(
            fetched["text"],
            source_label=fetched["host"],
            fetched_title=fetched["title"],
        )
    else:
        result = analyze(content, source_label="pasted text")

    return AnalyzeResponse(**result)