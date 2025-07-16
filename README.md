📄 Resume QA Chatbot
A smart, retrieval-augmented question-answering (QA) system that allows you to query your resume using natural language. Built with LangChain, FAISS, HuggingFace embeddings, and an LLM backend (e.g. Mistral).

✨ Features
Parses your resume PDF and chunks it by meaningful sections.

Embeds text using BAAI/bge-small-en-v1.5 and stores in a FAISS vector database.

Uses a custom prompt and a lightweight hosted LLM (mistral) to answer questions.

Ensures answers are grounded strictly in the resume content.

Includes a test harness with expected answers and retry logic.

🧠 Tech Stack
LangChain for chaining and retrieval

HuggingFaceEmbeddings for semantic embedding

FAISS for vector storage and similarity search

ChatOpenAI wrapper for a hosted Mistral LLM

Custom PDF chunking + labeling utils

📦 Setup
1. Install Dependencies
bash
Copy
Edit
pip install -r requirements.txt
Make sure to include:

langchain

langchain-community

langchain-huggingface

faiss-cpu

openai (for ChatOpenAI wrapper)

PyMuPDF or similar for PDF parsing

2. Add Resume
Place your resume in the root directory and name it:

vbnet
Copy
Edit
Resume.pdf
⚙️ Usage
Load + Process Resume
python
Copy
Edit
loader = PyPDFLoader("Resume.pdf")
documents = loader.load()
docs = chunk_by_ordered_sections(documents, section_names)
Embed + Index
python
Copy
Edit
embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en-v1.5")
db = FAISS.from_documents(docs, embeddings)
db.save_local("resume_vector_store")
Setup LLM & QA Chain
python
Copy
Edit
llm = ChatOpenAI(
    base_url="https://resume-bot-llm.onrender.com/",
    api_key="not-needed",
    model_name='mistral'
)

retriever = db.as_retriever(search_type="similarity", search_kwargs={"k": 2})
qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever, ...)
Run Questions
python
Copy
Edit
question = "What is my email address?"
result = qa_chain.invoke({"query": question})
print(result["result"])
🧪 Tests
A set of predefined QA test cases validate the chatbot's accuracy.

Each test includes:

✅ Question

📝 Expected answer

🔄 Retry logic (up to 3 times)

❌ Mismatch explanation with source text snippet

To run:

bash
Copy
Edit
python resume_chatbot.py
📁 Project Structure
text
Copy
Edit
.
├── Resume.pdf
├── resume_chatbot.py
├── utils.py  # includes `label_chunk` and `chunk_by_ordered_sections`
├── resume_vector_store/
└── README.md
🔐 Notes
Replace the base_url in ChatOpenAI if using your own hosted LLM.

The resume name, email, city, and other header info is treated as authoritative.

If information is not found, the model strictly returns:

vbnet
Copy
Edit
The answer is not found in the resume.
✅ Example Questions
What is the name on the resume?

What university did I attend?

What are my personal projects?

What is my highest degree?

What was my job title at AIMdyn?

📬 Contact
Built by Steven Liu — steventheliu@gmail.com
