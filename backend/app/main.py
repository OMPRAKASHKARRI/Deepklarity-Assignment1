from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Any, Dict
from .db import SessionLocal, engine, Base
from . import models
from .utils import scrape_wikipedia, generate_quiz_fallback
import json
import os

# Create app
app = FastAPI(title="AI Wiki Quiz Generator")

# Add CORS middleware FIRST (reversed order in FastAPI)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

class QuizRequest(BaseModel):
    url: str

@app.on_event("startup")
def startup_event():
    # create DB tables
    Base.metadata.create_all(bind=engine)

@app.post("/generate_quiz/")
def generate_quiz_api(request: QuizRequest) -> Dict[str, Any]:
    import random
    
    # Scrape the Wikipedia article
    try:
        scraped = scrape_wikipedia(request.url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Generate quiz (fallback)
    quiz_data = generate_quiz_fallback(scraped.get("text", ""), scraped.get("title", ""), num_questions=5)

    # Persist to DB
    db = SessionLocal()
    try:
        # Check if URL already exists
        existing = db.query(models.Quiz).filter(models.Quiz.url == request.url).first()
        if existing:
            # Return existing quiz, but randomize options each time
            db.refresh(existing)
            db.close()
            cached_quiz = json.loads(existing.full_quiz_data).get("quiz", [])
            # Randomize options for each question
            for q in cached_quiz:
                random.shuffle(q["options"])
            return {
                "id": existing.id,
                "url": existing.url,
                "title": existing.title,
                "summary": existing.summary,
                "quiz": cached_quiz,
                "related_topics": json.loads(existing.full_quiz_data).get("related_topics", []),
            }
        
        q = models.Quiz(
            url=request.url,
            title=scraped.get("title", ""),
            summary=scraped.get("summary", ""),
            scraped_content=scraped.get("raw_html", ""),
            full_quiz_data=json.dumps({"quiz": quiz_data, "related_topics": scraped.get("sections", [])}),
        )
        db.add(q)
        db.commit()
        db.refresh(q)
    finally:
        db.close()

    # Randomize options for new quiz too
    for question in quiz_data:
        random.shuffle(question["options"])

    return {
        "id": q.id,
        "url": q.url,
        "title": q.title,
        "summary": q.summary,
        "quiz": quiz_data,
        "related_topics": scraped.get("sections", []),
    }

@app.get("/history")
def list_history():
    db = SessionLocal()
    try:
        items = db.query(models.Quiz).order_by(models.Quiz.id.desc()).all()
        out = []
        for it in items:
            out.append({
                "id": it.id,
                "url": it.url,
                "title": it.title,
                "date_generated": it.created_at.isoformat() if it.created_at else None,
            })
        return out
    finally:
        db.close()

@app.get("/quiz/{quiz_id}")
def get_quiz(quiz_id: int):
    db = SessionLocal()
    try:
        it = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
        if not it:
            raise HTTPException(status_code=404, detail="Quiz not found")
        try:
            data = json.loads(it.full_quiz_data) if it.full_quiz_data else {}
        except Exception:
            data = {"quiz": [], "related_topics": []}
        return {
            "id": it.id,
            "url": it.url,
            "title": it.title,
            "summary": it.summary,
            "full_quiz_data": data
        }
    finally:
        db.close()

# ✅ Added SAFE FIX to prevent backend from crashing
@app.get("/")
def root():
    return {"message": "Backend is running"}
