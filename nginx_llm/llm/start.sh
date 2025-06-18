#!/bin/bash

# Start the Ollama server in the background
ollama serve &

# Wait a few seconds to ensure the server is ready
sleep 5

# Pull the model (you can change 'mistral' to any available model)
ollama pull mistral

# Bring the Ollama server to foreground so the container doesn't exit
fg %1
