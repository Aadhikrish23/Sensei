from fastapi import FastAPI
from app.routes import jd_routes
from app.routes import resume_routes
from app.routes import  matching_routes

app = FastAPI()

app.include_router(jd_routes.router)
app.include_router(resume_routes.router)
app.include_router(matching_routes.router)
@app.get("/")
def root():
    return {"message": "Sensei AI Service is running"}

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "sensei-ai"
    }