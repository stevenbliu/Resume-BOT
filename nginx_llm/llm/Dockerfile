FROM ollama/ollama:latest

# Copy your startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose Ollama API port
EXPOSE 11434

# Override ENTRYPOINT so CMD runs as-is
ENTRYPOINT []

# Run your startup script
CMD ["/start.sh"]
