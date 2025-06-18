# Base image
FROM ubuntu:22.04

# Install Ollama dependencies
RUN apt-get update && \
    apt-get install -y curl gnupg nginx supervisor

# basic auth for NGINX
RUN apt-get update && apt-get install -y apache2-utils

# Create a directory for the .htpasswd file
# RUN htpasswd -c .htpasswd ollamauser

# Install Ollama
RUN curl -fsSL https://ollama.com/install.sh | bash

# Pull your model (optional; can also happen on startup)
RUN /bin/bash -c "ollama serve & sleep 5 && ollama pull mistral"

# Add custom NGINX config
COPY nginx.conf /etc/nginx/nginx.conf

# Add supervisor config
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose only the HTTP port (Render uses port 10000 internally)
EXPOSE 80

# Start Supervisor to manage both NGINX and Ollama
CMD ["/usr/bin/supervisord"]
