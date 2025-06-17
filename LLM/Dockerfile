# Use Ollama's official base image
FROM ollama/ollama:latest

# Optional: pre-download a model (e.g., mistral, llama2, gemma)
# Comment this line if you prefer to load the model later manually
RUN ollama pull mistral

# Expose the default Ollama API port
EXPOSE 11434

# Ollama runs its server by default, so no CMD override is needed
