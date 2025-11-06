from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from utils.quiz_generator import generate_quiz

app = FastAPI(title="AI Wiki Quiz Generator")

class QuizRequest(BaseModel):
    url: str

@app.get("/")
def read_root():
    return {"message": "Backend is running successfully!"}

@app.post("/generate_quiz/")
async def generate_quiz_api(request: QuizRequest):
    try:
        result = generate_quiz(request.url)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
