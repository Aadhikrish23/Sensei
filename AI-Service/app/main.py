from fastapi import FastAPI
from app.routes import jd_parser

app = FastAPI()

app.include_router(jd_parser.router)
@app.get("/")
def root():
    return {"message": "Sensei AI Service is running"}

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "sensei-ai"
    }