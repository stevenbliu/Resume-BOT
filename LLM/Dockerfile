FROM vllm/vllm-openai:latest

# Optionally install extra tools or packages here if needed
# RUN pip install your-custom-dependencies

# Expose vLLM OpenAI-compatible endpoint
EXPOSE 11434

# Set the default command to launch the API with TinyLlama
CMD ["--model", "TinyLlama/TinyLlama-1.1B-Chat-v1.0"]
