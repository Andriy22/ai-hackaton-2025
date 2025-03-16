# Retina Image Analysis Service

A Python service for processing retina images, extracting biometric features, and comparing them to determine if two retina images belong to the same person.

## Features

- Retina image preprocessing
- Feature extraction from retina images:
  - Blood vessel extraction
  - Optic disc detection
  - Local Binary Pattern (LBP) feature extraction
  - Histogram of Oriented Gradients (HOG) feature extraction
  - Bifurcation point detection
  - Spatial distribution analysis of blood vessels
- Comparison of retina features for biometric identification
- Export and import of processed features to JSON files
- Azure Service Bus integration for message-based processing
- Azure Blob Storage integration for storing retina images

## Installation

1. Install the required dependencies:

```bash
pip install -r requirements.txt
```

2. Configure the `.env` file with your Azure credentials:

```
# Azure Service Bus Configuration
SERVICE_BUS_CONNECTION_STRING=your-service-bus-connection-string
SERVICE_BUS_QUEUE_NAME=retina-analysis-queue

# Azure Blob Storage Configuration
BLOB_CONNECTION_STRING=your-blob-connection-string
BLOB_CONTAINER_NAME=retina-images
```

## API Endpoints

- `POST /upload`: Upload a retina image for processing
- `POST /compare`: Compare two retina images to determine if they belong to the same person
- `POST /analyze`: Analyze a retina image and return visualization of the processing steps
- `POST /export`: Export retina features to a JSON file
- `POST /import`: Import retina features from a JSON file
- `GET /download/{filename}`: Download a previously exported JSON file
- `GET /list-exports`: List all exported retina feature files

## How It Works

The service uses computer vision techniques to:
1. Preprocess retina images (normalization, enhancement)
2. Extract key features:
   - Blood vessel patterns
   - Optic disc location
   - Bifurcation points (branching points in blood vessels)
   - Spatial distribution of blood vessels using a grid-based approach
3. Generate feature vectors for comparison
4. Compare feature vectors to determine similarity, considering:
   - Texture similarity (LBP, HOG)
   - Blood vessel density similarity
   - Bifurcation point matching
   - Spatial distribution similarity of blood vessels

## Export/Import Functionality

The service allows exporting processed retina features to JSON files, which can be used for future comparisons without reprocessing the original images. This is useful for:

- Creating a database of retina features for quick comparison
- Transferring retina features between systems
- Backing up processed data

JSON files include:
- Extracted features (LBP, HOG, bifurcation points, etc.)
- Base64-encoded preprocessed images
- Metadata (person ID, timestamp, etc.)

## Client Demo

A client demo script (`client_demo.py`) is provided to demonstrate how to use the retina image processing service. It supports the following operations:

```bash
# Upload a retina image
python client_demo.py --action upload --image path/to/retina.jpg

# Compare two retina images
python client_demo.py --action compare --image1 path/to/retina1.jpg --image2 path/to/retina2.jpg

# Compare using image IDs from previous uploads
python client_demo.py --action compare --image1_id ID1 --image2_id ID2

# Export features to JSON
python client_demo.py --action export --image_id ID --filename output.json --person_id "Person123"

# Import features from JSON
python client_demo.py --action import --json_file path/to/features.json

# List all exported JSON files
python client_demo.py --action list

# Analyze a retina image and display visualizations
python client_demo.py --action analyze --image path/to/retina.jpg

# Send retina scan request to Service Bus
python client_demo.py --action send-to-service-bus --image path/to/retina.jpg --employee-id employee123
```

## Azure Blob Storage Integration

The service uses Azure Blob Storage to store retina images. The `blob_storage.py` script handles the upload and download of images to and from Blob Storage.

## Technologies Used

- Python
- OpenCV for image processing
- NumPy for numerical operations
- scikit-image for feature extraction
- SciPy for spatial distance calculations
- FastAPI for the web service
- JSON for data export/import
- Azure Service Bus for message-based processing
- Azure Blob Storage for storing retina images

## Service Bus Integration

The service uses Azure Service Bus for message-based processing. The `service_processor.py` script listens to the Service Bus queue for retina scan requests and processes them accordingly.

## Message Format

The Service Bus messages should be in JSON format with the following structure:

```json
{
  "image_path": "/absolute/path/to/image.jpg",
  "employeeId": "employee123"
}
```

## Development

### Project Structure

- `service_processor.py`: Main service that processes messages from Service Bus
- `retina_processor.py`: Core functionality for retina image processing
- `service_bus.py`: Azure Service Bus integration
- `blob_storage.py`: Azure Blob Storage integration
- `client_demo.py`: Client for sending requests to Service Bus
