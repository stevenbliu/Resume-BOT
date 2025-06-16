from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from typing import Optional
import uvicorn

app = FastAPI()

# Reuse your QA logic setup here — load model, retriever, vector DB
from your_script import qa_chain, reindex_resume, validate_answer


class QARequest(BaseModel):
    question: str
    expected: Optional[str] = None
    retries: Optional[int] = 3


@app.post("/answer")
def ask_question(req: QARequest):
    for attempt in range(req.retries):
        result = qa_chain.invoke({"query": req.question})
        answer = result["result"]
        if not req.expected or req.expected.lower() in answer.lower():
            return {"answer": answer, "attempts": attempt + 1}
    return {"answer": answer, "attempts": req.retries, "status": "validation_failed"}


@app.post("/upload_resume")
def upload_resume(file: UploadFile = File(...)):
    # Save and reindex
    with open("Resume.pdf", "wb") as f:
        f.write(file.file.read())
    reindex_resume("Resume.pdf")  # you'd implement this to reload chunks/vector DB
    return {"status": "Resume uploaded and indexed"}


@app.get("/status")
def status():
    return {"status": "ready", "model": "TinyLlama"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
