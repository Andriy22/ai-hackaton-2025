# 👁️ Lumina-Secure: Enterprise Retina Management System

![Lumina-Secure](https://img.shields.io/badge/Lumina--Secure-1.0.0-brightgreen)
![Python](https://img.shields.io/badge/Python-3.10-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.103.1-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![Azure](https://img.shields.io/badge/Azure-Integrated-0078D4)

A comprehensive solution for managing organization's retina scans with advanced biometric processing capabilities. Lumina-Secure provides secure, efficient, and reliable retina authentication for enterprise security needs.

## ✨ Features

- 🔍 Advanced retina image preprocessing and analysis
- 🔐 Secure biometric authentication using retina patterns
- 🌐 FastAPI-powered RESTful API for integration
- 📊 Feature extraction from retina images:
  - 🩸 Blood vessel extraction and pattern recognition
  - 🔄 Optic disc detection
  - 🧬 Local Binary Pattern (LBP) feature extraction
  - 📈 Histogram of Oriented Gradients (HOG) feature extraction
  - 🔀 Bifurcation point detection
  - 📱 Spatial distribution analysis of blood vessels
- ☁️ Azure cloud integration:
  - 💾 Azure Blob Storage for image management
  - 📨 Azure Service Bus for message-based processing
  - 🗄️ Azure Cosmos DB for feature storage
- 🐳 Docker containerization for easy deployment
- 🔄 Real-time validation against employee database

## 🚀 Quick Start

### Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- Azure subscription (for cloud features)
- Python 3.10+ (for local development)

### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/lumina-secure.git
   cd lumina-secure
   ```

2. Configure environment variables in `.env` file:
   ```
   # Azure Blob Storage Configuration
   BLOB_CONNECTION_STRING=your-blob-connection-string
   BLOB_CONTAINER_NAME=retina-images

   # Azure Service Bus Configuration
   SERVICE_BUS_CONNECTION_STRING=your-service-bus-connection-string
   SERVICE_BUS_QUEUE_NAME=retina-analysis-queue
   AZURE_SERVICE_BUS_RESPONSE_QUEUE_NAME=response-queue
   AZURE_SERVICE_BUS_VALIDATION_RESPONSE_QUEUE_NAME=validation-response
   AZURE_SERVICE_BUS_VALIDATION_QUEUE_NAME=validation-queue

   # Azure Cosmos DB Configuration
   COSMOS_ENDPOINT=your-cosmos-endpoint
   COSMOS_KEY=your-cosmos-key
   COSMOS_DATABASE=your-cosmos-database
   COSMOS_CONTAINER=your-cosmos-container
   ```

3. Start the application with Docker Compose:
   ```bash
   docker-compose up -d
   ```

4. Access the API at http://localhost:8000

### Local Development

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Configure the `.env` file as shown above

3. Start the FastAPI server:
   ```bash
   uvicorn app:app --host 0.0.0.0 --port 8000
   ```

4. Start the Service Bus processor in a separate terminal:
   ```bash
   python main.py
   ```

## 🔌 API Endpoints

- `GET /`: Health check endpoint
- `POST /validate`: Validate a retina image against employee database

### Validation Request Example

```json
{
  "image_path": "path/to/retina/image.jpg",
  "employees": [
    {
      "employeeId": "emp123",
      "documentId": "doc456"
    }
  ],
  "messageId": "msg789",
  "originatingInstance": "instance1"
}
```

## 🏗️ Architecture

Lumina-Secure uses a microservices architecture with the following components:

1. **FastAPI Web Service**: Handles HTTP requests for retina validation
2. **Service Bus Processor**: Processes asynchronous retina validation requests
3. **Retina Processor**: Core engine for retina image analysis and feature extraction
4. **Storage Services**:
   - Azure Blob Storage for retina images
   - Azure Cosmos DB for feature storage

## 🧰 Technologies Used

- **Backend**:
  - Python 3.10
  - FastAPI & Uvicorn
  - OpenCV for image processing
  - NumPy & SciPy for numerical operations
  - scikit-image & scikit-learn for feature extraction and machine learning

- **Cloud Services**:
  - Azure Blob Storage
  - Azure Service Bus
  - Azure Cosmos DB

- **Deployment**:
  - Docker & Docker Compose
  - Supervisord for process management

## 🔒 Security Features

- Secure biometric validation
- Encrypted data storage
- Token-based authentication
- Comprehensive logging and auditing

## 📦 Project Structure

```
lumina-secure/
├── app.py                  # FastAPI application
├── main.py                 # Service Bus processor
├── retina_processor.py     # Core retina processing logic
├── blob_storage.py         # Azure Blob Storage integration
├── cosmos_db.py            # Azure Cosmos DB integration
├── service_bus.py          # Azure Service Bus integration
├── service_processor.py    # Message processing logic
├── requirements.txt        # Python dependencies
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose configuration
├── supervisord.conf        # Supervisor configuration
└── retina_data/            # Local data directory
```

## 🔬 Retina Comparison Algorithm

The Lumina-Secure system uses a sophisticated multi-stage algorithm to compare retina scans:

### 1. Image Preprocessing

Before any feature extraction or comparison can take place, the retina images undergo several preprocessing steps:

- **Resizing**: Images are standardized to 256×256 pixels for consistent processing
- **Grayscale Conversion**: Color images are converted to grayscale
- **Contrast Enhancement**: CLAHE (Contrast Limited Adaptive Histogram Equalization) is applied to enhance blood vessel visibility
- **Noise Reduction**: Gaussian blur is applied to reduce image noise

### 2. Feature Extraction

The system extracts multiple types of features from each retina image:

#### 2.1. Blood Vessel Extraction
- **Adaptive Thresholding**: Identifies blood vessels using Gaussian adaptive thresholding
- **Morphological Operations**: Opening operations enhance and clean up the blood vessel network
- **Skeletonization**: Creates a single-pixel-wide skeleton of the blood vessel network for further analysis

#### 2.2. Optic Disc Detection
- **Hough Circle Transform**: Detects the circular optic disc in the retina
- **Parameters**: The algorithm looks for circles with radius between 10-50 pixels

#### 2.3. Texture Analysis
- **Local Binary Pattern (LBP)**: Captures local texture patterns with 8 sampling points at radius 1
- **Histogram of Oriented Gradients (HOG)**: Analyzes gradient directions with 6 orientations and 32×32 pixel cells

#### 2.4. Blood Vessel Metrics
- **Vessel Density**: Percentage of the image covered by blood vessels
- **Average Vessel Length**: Mean length of detected blood vessel segments
- **Average Vessel Width**: Mean width of detected blood vessel segments
- **Vessel Count**: Total number of distinct blood vessel segments

#### 2.5. Bifurcation Point Detection
- **Junction Detection**: Uses a specialized kernel to identify points where blood vessels branch
- **Filtering**: Identifies points with at least 3 connecting branches
- **Peak Detection**: Uses local maxima detection to find the most significant bifurcation points (limited to 50 points for efficiency)

#### 2.6. Spatial Distribution Analysis
- **Grid-based Approach**: Divides the image into an 8×8 grid
- **Density Calculation**: Computes blood vessel density in each grid cell
- **Feature Vector**: Creates a 64-element vector representing the spatial distribution of vessels

### 3. Feature Comparison

When comparing two retina scans, the system performs a multi-faceted analysis:

#### 3.1. Texture Similarity
- **LBP Histogram Comparison**: Cosine similarity between LBP histograms
- **HOG Feature Comparison**: Cosine similarity between HOG feature vectors

#### 3.2. Vessel Pattern Similarity
- **Density Comparison**: Normalized difference between vessel densities
- **Length Comparison**: Normalized difference between average vessel lengths
- **Width Comparison**: Normalized difference between average vessel widths

#### 3.3. Bifurcation Point Matching
- **Distance Calculation**: Euclidean distances between all pairs of bifurcation points
- **Greedy Matching**: Points within a threshold distance (10 pixels) are considered matches
- **Similarity Score**: Ratio of matched points to the maximum number of points

#### 3.4. Spatial Distribution Similarity
- **Grid Comparison**: Cosine similarity between the vessel spatial distribution vectors

### 4. Weighted Similarity Calculation

The final similarity score is a weighted average of all individual similarity measures:

- **LBP Similarity**: 20% weight
- **HOG Similarity**: 20% weight
- **Vessel Density Similarity**: 10% weight
- **Vessel Length Similarity**: 10% weight
- **Vessel Width Similarity**: 5% weight
- **Bifurcation Point Similarity**: 20% weight
- **Vessel Spatial Similarity**: 15% weight

### 5. Match Determination

- The system considers two retinas to match if the overall similarity score exceeds 0.95 (95%)
- This threshold can be adjusted based on security requirements (higher for more strict matching)
