"""
Azure Blob Storage integration for retina image retrieval.
"""
import os
import tempfile
from typing import Optional
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("BlobStorageClient")

# Load environment variables
load_dotenv()

class BlobStorageClient:
    """
    Client for Azure Blob Storage operations.
    """
    def __init__(self):
        """Initialize the Blob Storage client."""
        self.connection_string = os.getenv("BLOB_CONNECTION_STRING")
        self.container_name = os.getenv("BLOB_CONTAINER_NAME")
        self.blob_service_client = None
        self.container_client = None
        
        if self.is_configured():
            try:
                self.blob_service_client = BlobServiceClient.from_connection_string(self.connection_string)
                self.container_client = self.blob_service_client.get_container_client(self.container_name)
                logger.info(f"Connected to Blob Storage container: {self.container_name}")
            except Exception as e:
                logger.error(f"Failed to connect to Blob Storage: {str(e)}")
    
    def is_configured(self) -> bool:
        """Check if Blob Storage is configured."""
        return (
            self.connection_string is not None and
            self.connection_string != "your-blob-connection-string" and
            self.container_name is not None
        )
    
    def download_blob_to_temp(self, blob_path: str) -> Optional[str]:
        """
        Download a blob to a temporary file.
        
        Args:
            blob_path: Path to the blob in the container
            
        Returns:
            Path to the downloaded temporary file, or None if download failed
        """
        if not self.is_configured() or self.container_client is None:
            logger.error("Blob Storage not configured or not connected")
            return None
        
        try:
            # Create a temporary file
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(blob_path)[1])
            temp_file_path = temp_file.name
            temp_file.close()
            
            # Get the blob client
            blob_client = self.container_client.get_blob_client(blob_path)
            
            # Download the blob to the temporary file
            with open(temp_file_path, "wb") as file:
                blob_data = blob_client.download_blob()
                file.write(blob_data.readall())
            
            logger.info(f"Downloaded blob {blob_path} to {temp_file_path}")
            return temp_file_path
            
        except Exception as e:
            logger.error(f"Error downloading blob {blob_path}: {str(e)}")
            # Clean up the temporary file if it was created
            if 'temp_file_path' in locals() and os.path.exists(temp_file_path):
                os.remove(temp_file_path)
            return None
    
    def list_blobs(self, prefix: Optional[str] = None) -> list:
        """
        List blobs in the container.
        
        Args:
            prefix: Optional prefix to filter blobs
            
        Returns:
            List of blob names
        """
        if not self.is_configured() or self.container_client is None:
            logger.error("Blob Storage not configured or not connected")
            return []
        
        try:
            blobs = self.container_client.list_blobs(name_starts_with=prefix)
            return [blob.name for blob in blobs]
        except Exception as e:
            logger.error(f"Error listing blobs: {str(e)}")
            return []
    
    def upload_blob(self, file_path: str, blob_path: Optional[str] = None) -> Optional[str]:
        """
        Upload a file to Blob Storage.
        
        Args:
            file_path: Path to the local file
            blob_path: Optional path to use in Blob Storage (default: filename)
            
        Returns:
            Path to the uploaded blob, or None if upload failed
        """
        if not self.is_configured() or self.container_client is None:
            logger.error("Blob Storage not configured or not connected")
            return None
        
        if not os.path.exists(file_path):
            logger.error(f"File not found: {file_path}")
            return None
        
        try:
            # Use the filename if blob_path is not provided
            if blob_path is None:
                blob_path = os.path.basename(file_path)
            
            # Get the blob client
            blob_client = self.container_client.get_blob_client(blob_path)
            
            # Upload the file
            with open(file_path, "rb") as file:
                blob_client.upload_blob(file, overwrite=True)
            
            logger.info(f"Uploaded {file_path} to blob {blob_path}")
            return blob_path
            
        except Exception as e:
            logger.error(f"Error uploading file {file_path}: {str(e)}")
            return None
    
    def delete_blob(self, blob_path: str) -> bool:
        """
        Delete a blob from storage.
        
        Args:
            blob_path: Path to the blob in the container
            
        Returns:
            True if deletion was successful, False otherwise
        """
        if not self.is_configured() or self.container_client is None:
            logger.error("Blob Storage not configured or not connected")
            return False
        
        try:
            # Get the blob client
            blob_client = self.container_client.get_blob_client(blob_path)
            
            # Delete the blob
            blob_client.delete_blob()
            
            logger.info(f"Deleted blob {blob_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting blob {blob_path}: {str(e)}")
            return False
