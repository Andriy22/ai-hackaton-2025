"""
Service processor for retina analysis using Azure Service Bus.
"""
import os
import asyncio
import json
import cv2
import numpy as np
from typing import Dict, Any, Optional
from retina_processor import RetinaProcessor
from cosmos_db import CosmosDBClient
from service_bus import ServiceBusHandler
from blob_storage import BlobStorageClient
from dotenv import load_dotenv
import uuid
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("RetinaScanProcessor")

# Load environment variables
load_dotenv()

class RetinaScanProcessor:
    """
    Processor for retina scans received from Service Bus.
    """
    def __init__(self):
        """Initialize the processor."""
        self.retina_processor = RetinaProcessor()
        self.cosmos_client = CosmosDBClient()
        self.service_bus = ServiceBusHandler()
        self.blob_client = BlobStorageClient()
        
        # Create output directory
        os.makedirs('retina_data', exist_ok=True)
    
    async def start(self):
        """Start processing messages from Service Bus."""
        logger.info("Starting Retina Scan Processor...")
        
        # Check if Cosmos DB is connected
        if self.cosmos_client.is_connected():
            logger.info("Connected to Cosmos DB")
        else:
            logger.warning("Not connected to Cosmos DB. Check your connection settings.")
        
        # Check if Service Bus is configured
        if self.service_bus.is_configured():
            logger.info("Service Bus is configured")
        else:
            logger.error("Service Bus is not configured. Check your .env file.")
            return
        
        # Check if Blob Storage is configured
        if self.blob_client.is_configured():
            logger.info("Blob Storage is configured")
        else:
            logger.error("Blob Storage is not configured. Check your .env file.")
            return
        
        # Start processing messages
        try:
            await self.service_bus.start_processing(self.process_message)
        except KeyboardInterrupt:
            logger.info("Keyboard interrupt received. Shutting down...")
        except Exception as e:
            logger.error(f"Error in message processing: {str(e)}")
        finally:
            self.service_bus.stop_processing()
            logger.info("Retina Scan Processor stopped")
    
    async def process_message(self, message_data: Dict[str, Any]):
        """
        Process a message from Service Bus.
        
        Args:
            message_data: Message data containing image_path and employeeId
        """
        try:
            # Extract data from message
            blob_path = message_data.get('image_path')
            employee_id = message_data.get('employeeId')
            
            if not blob_path:
                logger.error("Message missing required field: image_path")
                return
            
            logger.info(f"Processing image from blob: {blob_path} for employee: {employee_id}")
            
            # Download the image from Blob Storage
            temp_image_path = self.blob_client.download_blob_to_temp(blob_path)
            if not temp_image_path:
                logger.error(f"Failed to download image from blob: {blob_path}")
                return
            
            try:
                # Read the image
                image = cv2.imread(temp_image_path)
                if image is None:
                    logger.error(f"Could not read image from path: {temp_image_path}")
                    return
                
                # Extract features
                features = self.retina_processor.extract_features(image)
                
                # Export features to JSON and Cosmos DB
                feature_id = features.get("id", str(uuid.uuid4()))
                filename = f"{feature_id}.json"
                
                export_path = self.retina_processor.export_features_to_json(
                    features, 
                    filename=filename, 
                    person_id=employee_id
                )
                
                logger.info(f"Features exported to: {export_path}")
                
                # Return a success message (for logging purposes)
                result = {
                    "status": "success",
                    "message": "Image processed successfully",
                    "feature_id": feature_id,
                    "export_path": export_path,
                    "employee_id": employee_id,
                    "blob_path": blob_path
                }
                
                logger.info(f"Processing result: {result}")
                return result
                
            finally:
                # Clean up the temporary file
                try:
                    if os.path.exists(temp_image_path):
                        os.remove(temp_image_path)
                        logger.info(f"Removed temporary file: {temp_image_path}")
                except Exception as e:
                    logger.warning(f"Failed to remove temporary file {temp_image_path}: {str(e)}")
            
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")
            # Return an error message (for logging purposes)
            return {
                "status": "error",
                "message": f"Error processing image: {str(e)}",
                "employee_id": message_data.get('employeeId'),
                "blob_path": message_data.get('image_path')
            }

async def main():
    """Main function to start the processor."""
    processor = RetinaScanProcessor()
    await processor.start()

if __name__ == "__main__":
    asyncio.run(main())
