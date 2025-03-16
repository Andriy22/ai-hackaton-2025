FROM python:3.10-slim

WORKDIR /app

# Install system dependencies for OpenCV
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port for the API
EXPOSE 8000

# Environment variables - only set defaults for essential variables
ENV RUNNING_IN_CONTAINER=true
ENV ENVIRONMENT=production
ENV HOST=0.0.0.0
ENV PORT=8000

# Azure Blob Storage Configuration
ENV BLOB_CONNECTION_STRING=""
ENV BLOB_CONTAINER_NAME=""

# Azure Service Bus Configuration
ENV SERVICE_BUS_CONNECTION_STRING=""
ENV SERVICE_BUS_QUEUE_NAME=""
ENV AZURE_SERVICE_BUS_RESPONSE_QUEUE_NAME=""
ENV AZURE_SERVICE_BUS_VALIDATION_RESPONSE_QUEUE_NAME=""
ENV AZURE_SERVICE_BUS_VALIDATION_QUEUE_NAME=""

# Azure Cosmos DB Configuration
ENV COSMOS_ENDPOINT=""
ENV COSMOS_KEY=""
ENV COSMOS_DATABASE=""
ENV COSMOS_CONTAINER=""

# Use supervisord to manage multiple processes
RUN pip install supervisor

# Copy supervisord configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Command to run supervisord
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
