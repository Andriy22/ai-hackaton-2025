# Docker Setup for Retina Analyzer

This document explains how to build and run the Retina Analyzer application using Docker.

## Overview

The Retina Analyzer application consists of two main components:
1. **Service Bus Processor** (main.py) - Processes retina images from Azure Service Bus
2. **API Endpoint** (app.py) - Provides a health check endpoint at the root path (/)

Both components are packaged into a single Docker container and managed using Supervisor.

## Prerequisites

- Docker and Docker Compose installed
- Azure credentials configured in the .env file

## Building and Running

### Using Docker Compose (Recommended)

1. Build and start the container:
   ```bash
   docker-compose up -d
   ```

2. View logs:
   ```bash
   docker-compose logs -f
   ```

3. Stop the container:
   ```bash
   docker-compose down
   ```

### Using Docker Directly

1. Build the Docker image:
   ```bash
   docker build -t retina-analyzer .
   ```

2. Run the container:
   ```bash
   docker run -p 8000:8000 --env-file .env -v ./retina_data:/app/retina_data retina-analyzer
   ```

## Accessing the API

The health check endpoint is available at:
```
http://localhost:8000/
```

## Deploying to Azure

### Azure Container Registry

1. Build and tag the image:
   ```bash
   docker build -t <your-acr-name>.azurecr.io/retina-analyzer:latest .
   ```

2. Login to Azure Container Registry:
   ```bash
   az acr login --name <your-acr-name>
   ```

3. Push the image:
   ```bash
   docker push <your-acr-name>.azurecr.io/retina-analyzer:latest
   ```

### Azure App Service

1. Create an Azure Web App for Containers:
   ```bash
   az webapp create --resource-group <your-resource-group> --plan <your-app-service-plan> --name <your-app-name> --deployment-container-image-name <your-acr-name>.azurecr.io/retina-analyzer:latest
   ```

2. Configure the Web App to use your Azure Container Registry:
   ```bash
   az webapp config container set --name <your-app-name> --resource-group <your-resource-group> --docker-custom-image-name <your-acr-name>.azurecr.io/retina-analyzer:latest --docker-registry-server-url https://<your-acr-name>.azurecr.io
   ```

3. Configure environment variables:
   ```bash
   az webapp config appsettings set --resource-group <your-resource-group> --name <your-app-name> --settings @env-settings.json
   ```

## Troubleshooting

- **Container fails to start**: Check the logs using `docker-compose logs` or `docker logs <container-id>`
- **API not accessible**: Ensure port 8000 is exposed and not blocked by a firewall
- **Service Bus connection issues**: Verify the connection strings in your .env file
