"""
Client for sending retina scan requests to the Azure Service Bus.
"""
import os
import asyncio
import json
import argparse
from typing import Dict, Any
from azure.servicebus.aio import ServiceBusClient
from azure.servicebus import ServiceBusMessage
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def send_retina_scan_request(blob_path: str, employee_id: str) -> None:
    """
    Send a retina scan request to the Service Bus.
    
    Args:
        blob_path: Path to the image in Azure Blob Storage
        employee_id: Employee ID
    """
    # Get Service Bus connection details from environment variables
    connection_string = os.getenv("SERVICE_BUS_CONNECTION_STRING")
    queue_name = os.getenv("SERVICE_BUS_QUEUE_NAME")
    
    if not connection_string or connection_string == "your-service-bus-connection-string":
        print("Service Bus connection string not configured. Check your .env file.")
        return
    
    if not queue_name:
        print("Service Bus queue name not configured. Check your .env file.")
        return
    
    # Create the message data
    message_data = {
        "image_path": blob_path,
        "employeeId": employee_id
    }
    
    # Convert message data to JSON
    message_json = json.dumps(message_data)
    
    # Create a Service Bus message
    message = ServiceBusMessage(message_json)
    
    # Send the message
    print(f"Sending retina scan request for employee {employee_id}...")
    print(f"Blob path: {blob_path}")
    
    async with ServiceBusClient.from_connection_string(
        connection_string, 
        logging_enable=True
    ) as client:
        async with client.get_queue_sender(queue_name) as sender:
            await sender.send_messages(message)
    
    print("Request sent successfully!")
    print(f"The system will process the image from Blob Storage: {blob_path}")

async def main():
    """Main function to parse arguments and send a request."""
    parser = argparse.ArgumentParser(description="Send a retina scan request to the Service Bus")
    parser.add_argument("--blob-path", required=True, help="Path to the image in Azure Blob Storage")
    parser.add_argument("--employee-id", required=True, help="Employee ID")
    
    args = parser.parse_args()
    
    await send_retina_scan_request(args.blob_path, args.employee_id)

if __name__ == "__main__":
    asyncio.run(main())
