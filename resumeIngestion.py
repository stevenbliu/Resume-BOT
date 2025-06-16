from langchain.document_loaders import PyPDFLoader
import time

import collections
import collections.abc

collections.MutableSet = collections.abc.MutableSet
collections.MutableMapping = collections.abc.MutableMapping

# Profiling: Loading PDF
start = time.time()
loader = PyPDFLoader("Resume.pdf")
documents = loader.load()
print(f"Loaded PDF in {time.time() - start:.2f} seconds.")

# # Profiling: Splitting documents
start = time.time()
from langchain.text_splitter import RecursiveCharacterTextSplitter

UPDATED_CHUNKS = True  # Set to False if you want to use existing chunks
splitter = RecursiveCharacterTextSplitter(
    chunk_size=100, chunk_overlap=50, separators=["\n\n", "\n", ".", " "]
)
docs = splitter.split_documents(documents)
# print(f"Split documents in {time.time() - start:.2f} seconds.")

for i, chunk in enumerate(docs[:10]):
    print(f"\n--- Chunk {i + 1} ---")
    print("Text:\n", chunk.page_content)
    print("Metadata:\n", chunk.metadata)

# # Profiling: Embedding
# start = time.time()
from langchain.embeddings import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en-v1.5")
# print(f"Initialized embeddings in {time.time() - start:.2f} seconds.")

# # Profiling: Vector store creation
start = time.time()
from langchain_community.vectorstores import FAISS

if UPDATED_CHUNKS == True:
    db = FAISS.from_documents(docs, embeddings)
    db.save_local("resume_vector_store")
    print(f"Created and saved vector store in {time.time() - start:.2f} seconds.")
else:
    db = FAISS.load_local(
        "resume_vector_store", embeddings, allow_dangerous_deserialization=True
    )
    print(f"Loaded vector store in {time.time() - start:.2f} seconds.")

# Profiling: LLM and QA chain setup
start = time.time()
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

llm = ChatOpenAI(
    base_url="http://localhost:8000/v1",
    api_key="not-needed",
    model_name="TinyLlama/TinyLlama-1.1B-Chat-v1.0",
)
# retriever = db.as_retriever()
retriever = db.as_retriever(search_type="similarity", search_kwargs={"k": 3})

prompt_template = """
You are an assistant that answers questions using ONLY the provided resume content.
If the answer is not present in the resume, reply: "The answer is not found in the resume."

The resume format is as follows:
    Name, City, Social/Contact Info
    
    Category (e.g., Education, Experience, Skills):
        Role or Degree, Institution/Company, Dates
        - Description of responsibilities, achievements, and skills.

Resume:
{context}

Question: {question}
"""
prompt = PromptTemplate(
    input_variables=["context", "question"],
    template=prompt_template,
)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    return_source_documents=False,
    chain_type_kwargs={"prompt": prompt},
)

print(f"Set up LLM and QA chain in {time.time() - start:.2f} seconds.")

# Profiling: Question answering loop
questions = [
    "What is the name on the resume?",
    "Is Steven Liu in the resume?",
    "Who's resume is this?",
    # "What is my email address?",
    # "What is my phone number?",
    # "What is my highest degree?",
    # "What programming languages do I know?",
    # "What experience do I have with backend development?",
    # "What is my work experience?",
    # "What is my education background?",
]

for question in questions:
    start = time.time()
    print(f"Processing question: {question} started at {time.strftime('%H:%M:%S')}")
    response = qa_chain.run(question)
    elapsed = time.time() - start
    print(f"Q: {question}\nA: {response}\n(Time taken: {elapsed:.2f} seconds)\n")
