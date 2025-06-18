import httpx
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import json


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
BACKEND_URL = os.getenv("BACKEND_URL")
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


# RAG_SERVICE_URL = "http://rag:8000/answer"  # Use service name in Docker network


@app.post("/answer")
async def answer(request: Request):
    print("Received request to /answer endpoint with body:", await request.body())

    try:
        data = await request.json()
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON in request.")

    question = data.get("question")
    if not question:
        raise HTTPException(status_code=400, detail="Missing 'question' field.")

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                RAG_SERVICE_URL + "/answer", json={"question": question}
            )
            response.raise_for_status()
        except httpx.RequestError as exc:
            print(f"❌ Request failed: {exc}")
            raise HTTPException(status_code=502, detail="Failed to reach RAG service.")
        except httpx.HTTPStatusError as exc:
            print(f"❌ HTTP error: {exc}")
            raise HTTPException(
                status_code=502, detail="RAG service returned an error."
            )

        try:
            rag_response = response.json()  # ❌ this needs to be awaited!
        except json.JSONDecodeError:
            print("⚠️ Invalid JSON from RAG service:", response.text)
            raise HTTPException(
                status_code=502, detail="Invalid response from RAG service."
            )

    return {"answer": rag_response.get("answer", "No answer provided")}
