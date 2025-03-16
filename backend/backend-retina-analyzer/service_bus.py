"""
Azure Service Bus integration for retina analysis.
"""
import os
import json
import asyncio
from typing import Dict, Any, Callable, Awaitable, Optional
from azure.servicebus.aio import ServiceBusClient
from azure.servicebus import ServiceBusMessage
from dotenv import load_dotenv
import cv2
import numpy as np

# Load environment variables
load_dotenv()

class ServiceBusHandler:
    """
    Handler for Azure Service Bus integration.
    """
    def __init__(self):
        """Initialize the Service Bus handler."""
        self.connection_string = os.getenv("SERVICE_BUS_CONNECTION_STRING")
        self.queue_name = os.getenv("SERVICE_BUS_QUEUE_NAME")
        self.is_running = False
        self.processor = None
    
    def is_configured(self) -> bool:
        """Check if Service Bus is configured."""
        return (
            self.connection_string is not None and
            self.connection_string != "your-service-bus-connection-string" and
            self.queue_name is not None
        )
    
    async def start_processing(self, message_handler: Callable[[Dict[str, Any]], Awaitable[None]]) -> None:
        """
        Start processing messages from the Service Bus queue.
        
        Args:
            message_handler: Callback function to handle messages
        """
        if not self.is_configured():
            print("Service Bus not configured. Check your .env file.")
            return
        
        # Create a Service Bus client
        self.client = ServiceBusClient.from_connection_string(
            conn_str=self.connection_string,
            logging_enable=True
        )
        
        # Create a receiver for the queue
        self.receiver = self.client.get_queue_receiver(
            queue_name=self.queue_name,
            max_wait_time=5
        )
        
        print(f"Starting to process messages from queue: {self.queue_name}")
        
        async with self.client:
            async with self.receiver:
                self.processing = True
                
                while self.processing:
                    try:
                        # Receive a batch of messages
                        received_msgs = await self.receiver.receive_messages(max_message_count=10, max_wait_time=5)
                        
                        # Process each message in the batch
                        for msg in received_msgs:
                            try:
                                await self._process_message(msg, message_handler)
                                # Complete the message
                                await self.receiver.complete_message(msg)
                            except Exception as e:
                                print(f"Error processing message: {str(e)}")
                                # Abandon the message to make it available again
                                await self.receiver.abandon_message(msg)
                    except Exception as e:
                        print(f"Error receiving messages: {str(e)}")
                        # Sleep to avoid tight loop in case of persistent errors
                        await asyncio.sleep(1)
    
    async def _process_message(self, message: ServiceBusMessage, 
                              message_handler: Callable[[Dict[str, Any]], Awaitable[None]]) -> None:
        """
        Process a Service Bus message.
        
        Args:
            message: Service Bus message
            message_handler: Callback function to handle the message
        """
        try:
            # Parse the message body as JSON
            # Handle both string and generator message bodies
            if hasattr(message.body, 'decode'):
                # If it's bytes-like, decode it
                message_body = message.body.decode('utf-8')
            elif hasattr(message.body, '__iter__') and not isinstance(message.body, (str, bytes)):
                # If it's a generator or iterable, convert to bytes first
                message_bytes = b''.join(message.body)
                message_body = message_bytes.decode('utf-8')
            else:
                # If it's already a string
                message_body = str(message.body)
            
            message_data = json.loads(message_body)
            
            # Validate required fields
            if 'image_path' not in message_data:
                raise ValueError("Message missing required field: image_path")
            
            # Call the message handler with the parsed data
            await message_handler(message_data)
            
        except json.JSONDecodeError:
            print(f"Invalid JSON in message: {message.message_id}")
            raise
        except Exception as e:
            print(f"Error processing message {message.message_id}: {str(e)}")
            raise
    
    def stop_processing(self) -> None:
        """Stop processing messages."""
        self.processing = False
        print("Stopping Service Bus processing...")
    
    async def send_message(self, message_data: Dict[str, Any], queue_name: Optional[str] = None) -> None:
        """
        Send a message to a Service Bus queue.
        
        Args:
            message_data: Message data to send
            queue_name: Optional queue name to send the message to (defaults to self.queue_name)
        """
        if not self.is_configured():
            print("Service Bus is not properly configured. Check your .env file.")
            return
        
        # Use the provided queue name or default to the instance queue name
        target_queue = queue_name if queue_name else self.queue_name
        
        async with ServiceBusClient.from_connection_string(
            conn_str=self.connection_string,
            logging_enable=True
        ) as servicebus_client:
            async with servicebus_client.get_queue_sender(queue_name=target_queue) as sender:
                # Create a message
                message = ServiceBusMessage(json.dumps(message_data))
                
                # Send the message
                await sender.send_messages(message)
                print(f"Message sent to queue '{target_queue}': {message_data}")
    
    async def start_processing_multiple(self, message_handlers: Dict[str, Callable[[Dict[str, Any]], Awaitable[None]]]) -> None:
        """
        Start processing messages from multiple Service Bus queues with different handlers.
        
        Args:
            message_handlers: Dictionary mapping queue names to message handler functions
        """
        if not self.is_configured():
            print("Service Bus not configured. Check your .env file.")
            return
        
        if not message_handlers:
            print("No message handlers provided.")
            return
        
        # Create a Service Bus client
        self.client = ServiceBusClient.from_connection_string(
            conn_str=self.connection_string,
            logging_enable=True
        )
        
        # Start processing tasks for each queue
        self.processing = True
        processing_tasks = []
        
        for queue_name, handler in message_handlers.items():
            if not queue_name:
                print(f"Skipping empty queue name")
                continue
                
            print(f"Starting to process messages from queue: {queue_name}")
            task = asyncio.create_task(self._process_queue(queue_name, handler))
            processing_tasks.append(task)
        
        # Wait for all tasks to complete
        try:
            await asyncio.gather(*processing_tasks)
        except asyncio.CancelledError:
            print("Processing tasks cancelled")
        except Exception as e:
            print(f"Error in processing tasks: {str(e)}")
    
    async def _process_queue(self, queue_name: str, message_handler: Callable[[Dict[str, Any]], Awaitable[None]]) -> None:
        """
        Process messages from a specific Service Bus queue.
        
        Args:
            queue_name: Name of the queue to process
            message_handler: Callback function to handle messages
        """
        # Create a receiver for the queue
        async with self.client.get_queue_receiver(
            queue_name=queue_name,
            max_wait_time=5
        ) as receiver:
            while self.processing:
                try:
                    # Receive a batch of messages
                    received_msgs = await receiver.receive_messages(max_message_count=10, max_wait_time=5)
                    
                    # Process each message in the batch
                    for msg in received_msgs:
                        try:
                            await self._process_message(msg, message_handler)
                            # Complete the message
                            await receiver.complete_message(msg)
                        except Exception as e:
                            print(f"Error processing message from queue {queue_name}: {str(e)}")
                            # Abandon the message to make it available again
                            await receiver.abandon_message(msg)
                except Exception as e:
                    print(f"Error receiving messages from queue {queue_name}: {str(e)}")
                    # Sleep to avoid tight loop in case of persistent errors
                    await asyncio.sleep(1)
