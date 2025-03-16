"""
Azure Cosmos DB integration for storing and retrieving retina features.
"""
import os
from typing import Dict, Any, List, Optional
from azure.cosmos import CosmosClient, PartitionKey, exceptions
from dotenv import load_dotenv
import uuid
import json

# Load environment variables from .env file
load_dotenv()

class CosmosDBClient:
    """Client for interacting with Azure Cosmos DB."""
    
    def __init__(self):
        """Initialize the Cosmos DB client with connection parameters from environment variables."""
        # Get connection parameters from environment variables
        self.endpoint = os.getenv("COSMOS_ENDPOINT")
        self.key = os.getenv("COSMOS_KEY")
        self.database_name = os.getenv("COSMOS_DATABASE", "retina_database")
        self.container_name = os.getenv("COSMOS_CONTAINER", "retina_features")
        
        # Initialize the client
        self.client = None
        self.database = None
        self.container = None
        
        # Initialize connection if credentials are available
        if self.endpoint and self.key:
            self._initialize_connection()
    
    def _initialize_connection(self) -> None:
        """Initialize the connection to Cosmos DB."""
        try:
            # Create the client
            self.client = CosmosClient(self.endpoint, credential=self.key)
            
            # Get or create the database
            self.database = self.client.create_database_if_not_exists(id=self.database_name)
            
            # Get or create the container
            self.container = self.database.create_container_if_not_exists(
                id=self.container_name,
                partition_key=PartitionKey(path="/id"),
                offer_throughput=400  # Minimum throughput
            )
            
            print(f"Connected to Cosmos DB: {self.database_name}/{self.container_name}")
        except exceptions.CosmosHttpResponseError as e:
            print(f"Failed to connect to Cosmos DB: {str(e)}")
            self.client = None
            self.database = None
            self.container = None
    
    def is_connected(self) -> bool:
        """
        Check if the client is connected to Cosmos DB.
        
        Returns:
            True if connected, False otherwise
        """
        return self.container is not None
    
    def store_features(self, features: Dict[str, Any], person_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Store retina features in Cosmos DB.
        
        Args:
            features: Dictionary of retina features
            person_id: Optional person identifier
            
        Returns:
            The stored item with Cosmos DB metadata
        """
        if not self.is_connected():
            raise ConnectionError("Not connected to Cosmos DB")
        
        # Create a copy of the features to avoid modifying the original
        item = features.copy()
        
        # Add required fields for Cosmos DB
        item["id"] = str(uuid.uuid4())
        
        if person_id:
            item["person_id"] = person_id
        
        # Store the item
        try:
            result = self.container.create_item(body=item)
            print(f"Stored features in Cosmos DB with ID: {result['id']}")
            return result
        except exceptions.CosmosHttpResponseError as e:
            print(f"Failed to store features in Cosmos DB: {str(e)}")
            raise
    
    def get_features(self, item_id: str) -> Dict[str, Any]:
        """
        Get retina features from Cosmos DB by ID.
        
        Args:
            item_id: ID of the item to retrieve
            
        Returns:
            The retrieved item
        """
        if not self.is_connected():
            raise ConnectionError("Not connected to Cosmos DB")
        
        try:
            result = self.container.read_item(item=item_id, partition_key=item_id)
            return result
        except exceptions.CosmosResourceNotFoundError:
            raise ValueError(f"Item with ID {item_id} not found")
        except exceptions.CosmosHttpResponseError as e:
            print(f"Failed to get features from Cosmos DB: {str(e)}")
            raise
    
    def get_features_by_person_id(self, person_id: str) -> List[Dict[str, Any]]:
        """
        Get all retina features for a specific person.
        
        Args:
            person_id: Person identifier
            
        Returns:
            List of items for the person
        """
        if not self.is_connected():
            raise ConnectionError("Not connected to Cosmos DB")
        
        query = f"SELECT * FROM c WHERE c.person_id = @person_id"
        parameters = [{"name": "@person_id", "value": person_id}]
        
        try:
            items = list(self.container.query_items(
                query=query,
                parameters=parameters,
                enable_cross_partition_query=True
            ))
            return items
        except exceptions.CosmosHttpResponseError as e:
            print(f"Failed to query features from Cosmos DB: {str(e)}")
            raise
    
    def list_all_features(self) -> List[Dict[str, Any]]:
        """
        List all retina features in the container.
        
        Returns:
            List of all items
        """
        if not self.is_connected():
            raise ConnectionError("Not connected to Cosmos DB")
        
        try:
            items = list(self.container.query_items(
                query="SELECT * FROM c",
                enable_cross_partition_query=True
            ))
            return items
        except exceptions.CosmosHttpResponseError as e:
            print(f"Failed to list features from Cosmos DB: {str(e)}")
            raise
    
    def delete_features(self, item_id: str) -> None:
        """
        Delete retina features from Cosmos DB by ID.
        
        Args:
            item_id: ID of the item to delete
        """
        if not self.is_connected():
            raise ConnectionError("Not connected to Cosmos DB")
        
        try:
            self.container.delete_item(item=item_id, partition_key=item_id)
            print(f"Deleted features with ID: {item_id}")
        except exceptions.CosmosResourceNotFoundError:
            raise ValueError(f"Item with ID {item_id} not found")
        except exceptions.CosmosHttpResponseError as e:
            print(f"Failed to delete features from Cosmos DB: {str(e)}")
            raise
