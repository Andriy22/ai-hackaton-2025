"""
FastAPI application for retina analyzer service with health check endpoint.
This file is intended to be deployed to Azure Web App or run in a Docker container.
"""
import os
import logging
from fastapi import FastAPI
from datetime import datetime
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("RetinaAnalyzerAPI")

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Retina Analyzer API", 
    description="API for retina image processing service",
    version="1.0.0"
)

@app.get("/")
async def health_check():
    """
    Health check endpoint that returns the service status.
    
    Returns:
        Dict: Service status information
    """
    return {
        "status": "healthy",
        "service": "Retina Analyzer API",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "environment": os.getenv("ENVIRONMENT", "production")
    }

# This is used when running the app directly with Python
# In Docker, we'll use uvicorn through supervisord
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "0.0.0.0")
    logger.info(f"Starting FastAPI server on {host}:{port}")
    uvicorn.run(app, host=host, port=port)
