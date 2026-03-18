from fastapi import FastAPI,Request
from app.routes import jd_routes
from app.routes import resume_routes
from app.routes import  matching_routes
from app.routes import interview_routes

app = FastAPI()

@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = request.headers.get("x-request-id", "unknown")

    request.state.request_id = request_id

    response = await call_next(request)
    return response

app.include_router(jd_routes.router)
app.include_router(resume_routes.router)
app.include_router(matching_routes.router)
app.include_router(interview_routes.router)
@app.get("/")
def root():
    return {"message": "Sensei AI Service is running"}

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "sensei-ai"
    }