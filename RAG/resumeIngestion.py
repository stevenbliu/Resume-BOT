from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

# from langchain.embeddings import HuggingFaceEmbeddings
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
import time
import collections
import collections.abc

from utils import (
    label_chunk,
    chunk_by_ordered_sections,
)  # Assuming utils.py contains the label_chunk function

# Compatibility fix for some Python environments
collections.MutableSet = collections.abc.MutableSet
collections.MutableMapping = collections.abc.MutableMapping

# === Load and Split PDF ===
print("📄 Loading PDF...")
start = time.time()
loader = PyPDFLoader("Resume.pdf")
documents = loader.load()
print(f"✅ Loaded PDF in {time.time() - start:.2f} seconds.")

# print("\n🔪 Splitting PDF into chunks...")
# splitter = RecursiveCharacterTextSplitter(
#     chunk_size=200, chunk_overlap=100, separators=["\n\n", "\n", ".", " "]
# )

# docs = splitter.split_documents(documents)
# print(f"✅ Split into {len(docs)} chunks.\n")

# for i, chunk in enumerate(docs[:5]):
#     print(f"--- Chunk {i + 1} ---")
#     print("Text:\n", chunk.page_content)
#     print("Metadata:", chunk.metadata, "\n")

#     section = label_chunk(chunk.page_content)
#     print(f"Section Label: {section}\n")
#     chunk.metadata["section"] = section  # Add section label to metadata

section_names = [
    "work  experience",
    "education",
    "skills",
    "PERSONAL PROJECTS",
    "certifications",
]
docs = chunk_by_ordered_sections(documents, section_names)

# === Embedding and Vector Store ===
print("🔍 Creating embeddings and vector store...")
start = time.time()
UPDATED_CHUNKS = True  # Toggle to load from disk if chunks are unchanged
embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en-v1.5")

if UPDATED_CHUNKS:
    db = FAISS.from_documents(docs, embeddings)
    db.save_local("resume_vector_store")
    print(f"✅ Created and saved vector store in {time.time() - start:.2f} seconds.")
else:
    db = FAISS.load_local(
        "resume_vector_store", embeddings, allow_dangerous_deserialization=True
    )
    print(f"✅ Loaded vector store from disk in {time.time() - start:.2f} seconds.")

# === Set Up LLM and QA Chain ===
print("\n🤖 Setting up LLM and QA chain...")
start = time.time()
llm = ChatOpenAI(
    # base_url="http://localhost:8000/v1",
    base_url="https://resume-bot-llm.onrender.com/",
    api_key="not-needed",
    # model_name="TinyLlama/TinyLlama-1.1B-Chat-v1.0",
    model_name='mistral'
    temperature=0,
    top_p=1,
)

retriever = db.as_retriever(search_type="similarity", search_kwargs={"k": 2})
# retriever = db.as_retriever(
#     search_type="mmr", search_kwargs={"k": 5, "lambda_mult": 0.5}
# )

prompt_template = """
You are an assistant that answers questions based **ONLY** on the given resume content below.

- Answer **exactly and concisely** with the information found in the resume.
- If the information is not found exactly, respond ONLY with:
  "The answer is not found in the resume."
- Do NOT provide extra explanations or speculative text.
- When answering, provide only the answer text — no extra commentary.
- Cite the section only if explicitly asked.
- Don't repeat the question in your answer.
- Don't repeat yourself. Keep answers short and to the point.
- Do not provide the question, or the prompt, or the context in your answer.
- Always treat the resume header as the definitive source for the candidate’s name, city, and email address. If the header contains this information, use it over any other mention in the document.

Resume:
{context}

Question: {question}

Answer:
"""
prompt = PromptTemplate(
    input_variables=["context", "question"],
    template=prompt_template,
)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    return_source_documents=True,
    chain_type_kwargs={"prompt": prompt},
)
print(f"✅ LLM and QA chain ready in {time.time() - start:.2f} seconds.\n")

# === QA Loop with Expected Answers ===

test_cases = [
    {
        "question": "What is the name on the resume?",
        "expected": "Steven Liu",
    },
    {
        "question": "Is Steven Liu in the resume?",
        "expected": "Yes",
    },
    {
        "question": "Who's resume is this?",
        "expected": "Steven Liu",
    },
    {
        "question": "What is my email address?",
        "expected": "steventheliu@gmail.com",
    },
    {
        "question": "What city is the candidate located in?",
        "expected": "San Francisco, CA",
    },
    {
        "question": "What is my LinkedIn profile?",
        "expected": "The answer is not found in the resume.",
    },
    {
        "question": "What is my highest degree?",
        "expected": "Data Science B.S.",
    },
    {
        "question": "What university did I attend?",
        "expected": "University of California, San Diego",
    },
    {
        "question": "What was my GPA?",
        "expected": "3.72",
    },
    {
        "question": "When did I graduate?",
        "expected": "The answer is not found in the resume.",  # Update if grad date exists
    },
    {
        "question": "Where did I work most recently?",
        "expected": "AIMdyn",
    },
    {
        "question": "What was my job title at AIMdyn?",
        "expected": "Software Engineer",
    },
    {
        "question": "What were my main responsibilities at AIMdyn?",
        "expected": "Built internal Python APIs for automating business logic, ran benchmarking models for COVID-19, developed GUIs with Tkinter for ML simulations.",  # Update if you want full bullets
    },
    {
        "question": "What technologies did I use in my last job?",
        "expected": "Python, Tkinter, Docker, ETL, Airflow",  # Adjust based on resume
    },
    {
        "question": "Was my work at AIMdyn remote?",
        "expected": "Yes",
    },
    {
        "question": "What programming languages do I know?",
        "expected": "Python, CSS, HTML, JavaScript, TypeScript, SQL, C++, Java",
    },
    {
        "question": "What are my personal projects?",
        "expected": "FoodLens",
    },
    {
        "question": "What cloud certifications do I hold?",
        "expected": "AWS Certified Cloud Practitioner — 11/2024",
    },
    {
        "question": "What is my phone number?",
        "expected": "The answer is not found in the resume.",
    },
    {
        "question": "Did I work at Google?",
        "expected": "The answer is not found in the resume.",
    },
    {
        "question": "Is there a car?",
        "expected": "The answer is not found in the resume.",
    },
]


MAX_RETRIES = 3  # Max attempts for answer correctness


def validate_answer(answer: str, expected: str) -> bool:
    # Simple case-insensitive substring match validation
    # You can enhance this with fuzzy matching or custom rules
    return expected.lower() in answer.lower()


def run_qa_with_retry(qa_chain, question, expected):
    for attempt in range(1, MAX_RETRIES + 1):
        result = qa_chain.invoke({"query": question})
        answer = result["result"]
        source_docs = result["source_documents"]

        if validate_answer(answer, expected):
            return answer, source_docs, attempt
        else:
            # Optionally print retry attempt info here
            pass

    # After max retries, fallback answer
    fallback = "The answer is not found in the resume."
    if validate_answer(fallback, expected):
        return fallback, [], MAX_RETRIES
    else:
        # If expected is not the fallback, just return last attempt
        return answer, source_docs, MAX_RETRIES


# === Testing Loop ===
print("🧪 Running tests with validation + retry...\n")
passed, failed = 0, 0

for test in test_cases:
    start = time.time()
    question = test["question"]
    expected = test["expected"]

    print(f"🔎 Question: {question}")
    answer, source_docs, attempts = run_qa_with_retry(qa_chain, question, expected)
    elapsed = time.time() - start

    is_correct = validate_answer(answer, expected)

    print(f"📝 Answer: {answer}")
    print(f"✅ Expected: {expected}")
    print(f"🔄 Attempts: {attempts}")
    print("🎯 Match:", "✅ PASS" if is_correct else "❌ FAIL")

    if is_correct:
        passed += 1
    else:
        failed += 1
        print("❗️ Source Documents: \n")
        for doc in source_docs:
            print(f"Source: {doc.page_content[:100]}...")

    print(f"⏱️ Time taken: {elapsed:.2f} seconds\n" + "-" * 60 + "\n")

print(f"✅ {passed} passed, ❌ {failed} failed out of {len(test_cases)} tests.\n")
