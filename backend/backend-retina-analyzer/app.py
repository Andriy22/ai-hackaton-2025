"""
FastAPI application for retina analyzer service with health check endpoint.
This file is intended to be deployed to Azure Web App or run in a Docker container.
"""
import os
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from dotenv import load_dotenv
from retina_processor import RetinaProcessor
from cosmos_db import CosmosDBClient
from blob_storage import BlobStorageClient
import uuid
import asyncio

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

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize components
retina_processor = RetinaProcessor()
cosmos_client = CosmosDBClient()
blob_client = BlobStorageClient()

# Define request models
class EmployeeReference(BaseModel):
    employeeId: str
    documentId: str

class RetinaValidationRequest(BaseModel):
    image_path: str
    employees: List[EmployeeReference]
    messageId: str
    originatingInstance: Optional[str] = None

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

@app.post("/validate")
async def validate_retina(request: RetinaValidationRequest):
    """
    Validate a retina image against multiple employee retina scans.
    
    Args:
        request: Validation request containing image path and employee references
    
    Returns:
        Dict: Validation results including matching employee ID if found
    """
    try:
        logger.info(f"Received validation request: {request}")
        
        # Extract data from request
        blob_path = request.image_path
        employees = [{"employeeId": emp.employeeId, "documentId": emp.documentId} for emp in request.employees]
        message_id = request.messageId
        
        if not blob_path:
            logger.error("Request missing required field: image_path")
            raise HTTPException(status_code=400, detail="Missing required field: image_path")
        
        if not employees:
            logger.error("Request missing required field: employees")
            raise HTTPException(status_code=400, detail="Missing required field: employees")
        
        logger.info(f"Validating retina image from blob: {blob_path} against {len(employees)} employees")
        
        # Download the image from Blob Storage
        temp_image_path = blob_client.download_blob_to_temp(blob_path)
        if not temp_image_path:
            logger.error(f"Failed to download image from blob: {blob_path}")
            raise HTTPException(status_code=404, detail=f"Failed to download image from blob: {blob_path}")
        
        try:
            # Read the image
            import cv2
            image = cv2.imread(temp_image_path)
            if image is None:
                logger.error(f"Could not read image from path: {temp_image_path}")
                raise HTTPException(status_code=400, detail=f"Could not read image from path: {temp_image_path}")
            
            # Extract features from the input image
            input_features = retina_processor.extract_features(image)
            
            # Compare with each employee's retina features
            matching_employee_id = None
            highest_similarity = 0.0
            
            for employee in employees:
                employee_id = employee.get('employeeId')
                document_id = employee.get('documentId')
                
                if not document_id:
                    logger.warning(f"Missing documentId for employee: {employee_id}")
                    continue
                
                try:
                    # Get employee's retina features from Cosmos DB
                    employee_features = cosmos_client.get_features(document_id)
                    
                    # Compare features
                    comparison_result = retina_processor.compare_features(
                        input_features, 
                        employee_features
                    )
                    
                    similarity = comparison_result.get('overall_similarity', 0.0)
                    is_match = comparison_result.get('is_match', False)
                    
                    logger.info(f"Comparison with employee {employee_id}: similarity={similarity}, is_match={is_match}")
                    
                    # If it's a match and has higher similarity than previous matches
                    if is_match and similarity > highest_similarity:
                        highest_similarity = similarity
                        matching_employee_id = employee_id
                
                except Exception as e:
                    logger.warning(f"Error comparing with employee {employee_id}: {str(e)}")
                    continue
            
            # Prepare response
            response = {
                "status": "success",
                "matchingEmployeeId": matching_employee_id,
                "similarity": highest_similarity if matching_employee_id else 0.0,
                "messageId": message_id
            }
            
            logger.info(f"Validation response: {response}")
            return response
            
        finally:
            # Clean up the temporary file
            try:
                if os.path.exists(temp_image_path):
                    os.remove(temp_image_path)
                    logger.info(f"Removed temporary file: {temp_image_path}")
            except Exception as e:
                logger.warning(f"Failed to remove temporary file {temp_image_path}: {str(e)}")
        
    except Exception as e:
        logger.error(f"Error validating retina: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error validating retina: {str(e)}")

# This is used when running the app directly with Python
# In Docker, we'll use uvicorn through supervisord
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "0.0.0.0")
    logger.info(f"Starting FastAPI server on {host}:{port}")
    uvicorn.run(app, host=host, port=port)
