from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import router
from app.chatbot.router import router as chatbot_router
app = FastAPI(
    title="Doctor Prescription Analyzer",
    version="1.0.0"
)

app.include_router(
    router,
    prefix="/api/v1",
    tags=["Prescription Analysis"]
)
app.include_router(chatbot_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():

    return {

        "message": "Doctor Prescription Analyzer API"

    }