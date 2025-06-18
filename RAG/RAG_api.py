from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from typing import Optional
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

env_mode = os.getenv("APP_ENV", "development")
load_dotenv(f".env.{env_mode}")

# Load URLs from env
FRONTEND_URL = os.getenv("FRONTEND_URL")
RAG_SERVICE_URL = os.getenv("RAG_URL") + "/answer"  # append path as needed
BACKEND_URL = os.getenv("BACKEND_URL")

app = FastAPI()

# Allow requests from your frontend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:3000",
#         "http://localhost:80",
#         "http://localhost:8000",
#         "http://localhost",
#     ],  # or ["*"] for all origins (not recommended for production)
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

origins = [
    FRONTEND_URL,
    BACKEND_URL,
    "http://localhost:3000",  # fallback for local dev, optional
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Allowed CORS origins:", origins)

# Reuse your QA logic setup here — load model, retriever, vector DB
# from your_script import qa_chain, reindex_resume, validate_answer


class QARequest(BaseModel):
    question: str
    expected: Optional[str] = None
    retries: Optional[int] = 3


@app.post("/answer")
def ask_question(req: QARequest):
    for attempt in range(req.retries):
        # result = qa_chain.invoke({"query": req.question})
        result = {
            "result": "dummy answer222 from RAG API"
        }  # Replace with actual QA chain invocation
        answer = result["result"]
        if not req.expected or req.expected.lower() in answer.lower():
            return {"answer": answer, "attempts": attempt + 1}
    return {"answer": answer, "attempts": req.retries, "status": "validation_failed"}


@app.post("/upload_resume")
def upload_resume(file: UploadFile = File(...)):
    # Save and reindex
    with open("Resume.pdf", "wb") as f:
        f.write(file.file.read())
    # reindex_resume("Resume.pdf")  # you'd implement this to reload chunks/vector DB
    return {"status": "Resume uploaded and indexed"}


@app.get("/status")
def status():
    return {"status": "ready", "model": "TinyLlama"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
