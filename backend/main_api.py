import httpx
from fastapi import FastAPI, Request

app = FastAPI()

RAG_SERVICE_URL = "http://rag:8000/qa"  # Use service name in Docker network


@app.post("/answer")
async def answer(request: Request):
    data = await request.json()
    question = data.get("question")

    async with httpx.AsyncClient() as client:
        response = await client.post(RAG_SERVICE_URL, json={"question": question})
        rag_response = response.json()

    return {"answer": rag_response.get("answer")}
