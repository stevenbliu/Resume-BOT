FROM ollama/ollama:latest

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 11434

# Run startup script (serve + pull + stay alive)
CMD ["/start.sh"]
