import httpx
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:80",
        "http://localhost:8000",
        "http://localhost",
    ],  # or ["*"] for all origins (not recommended for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

RAG_SERVICE_URL = "http://rag:8000/answer"  # Use service name in Docker network


@app.post("/answer")
async def answer(request: Request):
    print("Received request to /answer endpoint with body:", await request.body())
    data = await request.json()
    question = data.get("question")

    async with httpx.AsyncClient() as client:
        response = await client.post(RAG_SERVICE_URL, json={"question": question})
        # response = "dummy response"  # Replace with actual call to RAG service
        rag_response = response.json()

    return {"answer": rag_response.get("answer")}
    # return {"answer": response}


@app.post("/wrong")
async def wrong(request: Request):
    print("Received request to /answer endpoint with body:", await request.body())
    data = await request.json()
    question = data.get("question")

    async with httpx.AsyncClient() as client:
        response = await client.post(RAG_SERVICE_URL, json={"question": question})
        rag_response = response.json()

    return {"answer": rag_response.get("answer")}


@app.post("/asd")
async def asd(request: Request):
    print("Received request to /answer endpoint with body:", await request.body())
    data = await request.json()
    question = data.get("question")

    async with httpx.AsyncClient() as client:
        response = await client.post(RAG_SERVICE_URL, json={"question": question})
        rag_response = response.json()

    return {"answer": rag_response.get("answer")}
