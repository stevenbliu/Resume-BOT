import httpx
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

env_mode = os.getenv("APP_ENV", "development")
env_path = f".env.{env_mode}"
env_loaded = load_dotenv(env_path)
print(f"Using environment: {env_mode}")

if env_loaded:
    print(f"Loaded environment file: {env_path}")
else:
    print(
        f"WARNING: Environment file not found {env_path}. Using default environment variables."
    )


# Load URLs from env
FRONTEND_URL = os.getenv("FRONTEND_URL")
RAG_SERVICE_URL = os.getenv("RAG_URL")  # + "/answer"  # append path as needed
print(f"RAG Service URL: {RAG_SERVICE_URL}")
print(f"Frontend URL: {FRONTEND_URL}")

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
        "http://localhost:3000",  # fallback for local dev, optional
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# RAG_SERVICE_URL = "http://rag:8000/answer"  # Use service name in Docker network


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
