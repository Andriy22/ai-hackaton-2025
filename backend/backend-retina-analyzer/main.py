"""
Main module for retina image processing service using Azure Service Bus.
"""
import os
import asyncio
import logging
from retina_processor import RetinaProcessor
from cosmos_db import CosmosDBClient
from service_bus import ServiceBusHandler
from blob_storage import BlobStorageClient
from dotenv import load_dotenv
import uuid
import cv2
from typing import Dict, Any, List, Optional
import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("RetinaAnalyzer")

# Load environment variables
load_dotenv()

class RetinaAnalyzerService:
    """
    Service for processing retina images from Azure Service Bus messages.
    """
    def __init__(self):
        """Initialize the service components."""
        logger.info("Initializing Retina Analyzer Service...")
        self.retina_processor = RetinaProcessor()
        self.cosmos_client = CosmosDBClient()
        self.service_bus = ServiceBusHandler()
        self.blob_client = BlobStorageClient()
        self.response_queue_name = os.getenv("AZURE_SERVICE_BUS_RESPONSE_QUEUE_NAME")
        self.validation_queue_name = os.getenv("AZURE_SERVICE_BUS_VALIDATION_QUEUE_NAME")
        self.validation_response_queue_name = os.getenv("AZURE_SERVICE_BUS_VALIDATION_RESPONSE_QUEUE_NAME")
    
    async def start(self):
        """Start the service and begin processing messages from Service Bus."""
        logger.info("Starting Retina Analyzer Service...")
        
        # Check if Cosmos DB is connected
        if self.cosmos_client.is_connected():
            logger.info("Connected to Cosmos DB")
        else:
            logger.error("Not connected to Cosmos DB. Check your connection settings.")
            return
        
        # Check if Service Bus is configured
        if self.service_bus.is_configured():
            logger.info("Service Bus is configured")
        else:
            logger.error("Service Bus is not configured. Check your .env file.")
            return
        
        # Check if response queue is configured
        if not self.response_queue_name:
            logger.error("Response queue name not configured. Check your .env file.")
            return
        else:
            logger.info(f"Response queue configured: {self.response_queue_name}")
        
        # Check if validation queue is configured
        if not self.validation_queue_name:
            logger.error("Validation queue name not configured. Check your .env file.")
            return
        else:
            logger.info(f"Validation queue configured: {self.validation_queue_name}")
        
        # Check if validation response queue is configured
        if not self.validation_response_queue_name:
            logger.error("Validation response queue name not configured. Check your .env file.")
            return
        else:
            logger.info(f"Validation response queue configured: {self.validation_response_queue_name}")
        
        # Check if Blob Storage is configured
        if self.blob_client.is_configured():
            logger.info("Blob Storage is configured")
        else:
            logger.error("Blob Storage is not configured. Check your .env file.")
            return
        
        # Start processing messages
        try:
            logger.info("Starting to process messages from Service Bus...")
            # Create a message handler mapping for different queues
            message_handlers = {
                os.getenv("SERVICE_BUS_QUEUE_NAME"): self.process_message,
                self.validation_queue_name: self.validate_retina
            }
            await self.service_bus.start_processing_multiple(message_handlers)
        except KeyboardInterrupt:
            logger.info("Keyboard interrupt received. Shutting down...")
        except Exception as e:
            logger.error(f"Error in message processing: {str(e)}")
        finally:
            self.service_bus.stop_processing()
            logger.info("Retina Analyzer Service stopped")
    
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
            file_id = message_data.get('imgId')
            
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
                
                # Store features in Cosmos DB
                cosmos_id = self.retina_processor.export_features_to_json(
                    features, 
                    person_id=employee_id
                )
                
                if cosmos_id:
                    logger.info(f"Features stored in Cosmos DB with ID: {cosmos_id}")
                    
                    # Create response message
                    response_message = {
                        "status": "success",
                        "id": cosmos_id,
                        "employeeId": employee_id,
                        "originalImage": blob_path,
                        "imgId": file_id
                    }
                    
                    # Send response message back to Service Bus response queue
                    await self.service_bus.send_message(
                        message_data=response_message,
                        queue_name=self.response_queue_name
                    )
                    logger.info(f"Response message sent to queue '{self.response_queue_name}': {response_message}")
                    
                    return response_message
                else:
                    logger.error("Failed to store features in Cosmos DB")
                    
                    # Send error message back to Service Bus response queue
                    error_message = {
                        "status": "error",
                        "message": "Failed to store features in Cosmos DB",
                        "employeeId": employee_id,
                        "originalImage": blob_path,
                        "imgId": file_id
                    }
                    
                    await self.service_bus.send_message(
                        message_data=error_message,
                        queue_name=self.response_queue_name
                    )
                    logger.info(f"Error message sent to queue '{self.response_queue_name}': {error_message}")
                    
                    return error_message
                
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
            
            # Send error message back to Service Bus response queue
            error_message = {
                "status": "error",
                "message": f"Error processing image: {str(e)}",
                "employeeId": message_data.get('employeeId'),
                "originalImage": message_data.get('image_path'),
                "imgId": message_data.get('imgId')
            }
            
            try:
                await self.service_bus.send_message(
                    message_data=error_message,
                    queue_name=self.response_queue_name
                )
                logger.info(f"Error message sent to queue '{self.response_queue_name}': {error_message}")
            except Exception as send_error:
                logger.error(f"Failed to send error message to Service Bus: {str(send_error)}")
            
            return error_message
    
    async def _send_validation_response(self, response_data: Dict[str, Any]) -> None:
        """
        Helper method to send validation responses to the correct queue.
        
        This ensures all validation responses are sent to the validation response queue
        with proper error handling and logging.
        
        Args:
            response_data: The response data to send
        """
        if not self.validation_response_queue_name:
            logger.error("Validation response queue name not configured. Cannot send response.")
            return
            
        try:
            # Ensure messageId is included
            if 'messageId' not in response_data:
                response_data['messageId'] = str(uuid.uuid4())
                
            # Add timestamp
            response_data['timestamp'] = str(datetime.datetime.now())
            
            # Send the message
            await self.service_bus.send_message(
                message_data=response_data,
                queue_name=self.validation_response_queue_name
            )
            logger.info(f"Validation response sent to queue '{self.validation_response_queue_name}': {response_data}")
        except Exception as e:
            logger.error(f"Failed to send validation response: {str(e)}")
            logger.error(f"Response data that failed to send: {response_data}")
    
    async def validate_retina(self, message_data: Dict[str, Any]):
        """
        Validate a retina image against multiple employee retina scans.
        
        Args:
            message_data: Message data containing image_path and employees list
                Format: {
                    "image_path": "path/to/blob/image.jpg",
                    "employees": [
                        {"employeeId": "emp123", "documentId": "cosmos_doc_id"},
                        ...
                    ]
                }
                
        Returns:
            Dictionary with validation results, including matching employee ID if found
        """
        try:
            # Extract data from message
            blob_path = message_data.get('image_path')
            employees = message_data.get('employees', [])

            logger.info(f"Received employees data: {message_data}")
            message_id = message_data.get('messageId', str(uuid.uuid4()))
            originating_instance = message_data.get('originatingInstance', None)
            
            if not blob_path:
                logger.error("Message missing required field: image_path")
                response = {
                    "status": "error",
                    "message": "Missing required field: image_path",
                    "matchingEmployeeId": None,
                    "messageId": message_id
                }
                await self._send_validation_response(response)
                return response
            
            if not employees:
                logger.error("Message missing required field: employees")
                response = {
                    "status": "error",
                    "message": "Missing required field: employees",
                    "matchingEmployeeId": None,
                    "messageId": message_id
                }
                await self._send_validation_response(response)
                return response
            
            logger.info(f"Validating retina image from blob: {blob_path} against {len(employees)} employees")
            
            # Download the image from Blob Storage
            temp_image_path = self.blob_client.download_blob_to_temp(blob_path)
            if not temp_image_path:
                logger.error(f"Failed to download image from blob: {blob_path}")
                response = {
                    "status": "error",
                    "message": f"Failed to download image from blob: {blob_path}",
                    "matchingEmployeeId": None,
                    "messageId": message_id
                }
                await self._send_validation_response(response)
                return response
            
            try:
                # Read the image
                image = cv2.imread(temp_image_path)
                if image is None:
                    logger.error(f"Could not read image from path: {temp_image_path}")
                    response = {
                        "status": "error",
                        "message": f"Could not read image from path: {temp_image_path}",
                        "matchingEmployeeId": None,
                        "messageId": message_id
                    }
                    await self._send_validation_response(response)
                    return response
                
                # Extract features from the input image
                input_features = self.retina_processor.extract_features(image)
                
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
                        employee_features = self.cosmos_client.get_features(document_id)
                        
                        # Compare features
                        comparison_result = self.retina_processor.compare_features(
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
                
                # Send response
                await self._send_validation_response(response)
                
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
            
            # Send error message
            error_response = {
                "status": "error",
                "message": f"Error validating retina: {str(e)}",
                "matchingEmployeeId": None,
                "messageId": message_data.get('messageId', str(uuid.uuid4()))
            }
            
            await self._send_validation_response(error_response)
            
            return error_response

async def main():
    """Main function to start the service."""
    service = RetinaAnalyzerService()
    await service.start()

if __name__ == "__main__":
    # Run the service bus processing
    asyncio.run(main())
