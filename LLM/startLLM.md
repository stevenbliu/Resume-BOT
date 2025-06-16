# Install vLLM from pip:
pip install vllm

# Load and run the model:
vllm serve "deepseek-ai/DeepSeek-R1-0528"

# Call the server using curl:
curl -X POST "http://localhost:8000/v1/chat/completions" \
	-H "Content-Type: application/json" \
	--data '{
		"model": "deepseek-ai/DeepSeek-R1-0528",
		"messages": [
			{
				"role": "user",
				"content": "What is the capital of France?"
			}
		]
	}'

# model to serve
vllm serve --model mistralai/Mistral-7B-Instruct-v0.2

# docker run
docker run --gpus all -p 8000:8000 vllm/vllm-openai --model mistralai/Mistral-7B-Instruct-v0.2

# smaller model
docker run --gpus all -p 8000:8000 vllm/vllm-openai --model TinyLlama/TinyLlama-1.1B-Chat-v1.0

# Docker file
  docker build -t custom-vllm .
docker run --gpus all -p 8000:8000 custom-vllm
