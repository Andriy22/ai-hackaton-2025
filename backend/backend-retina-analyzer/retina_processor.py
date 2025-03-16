"""
Retina image processing module for feature extraction and comparison.
"""
import cv2
import numpy as np
from skimage.feature import local_binary_pattern
from skimage.feature import hog
from skimage.measure import regionprops
from sklearn.metrics.pairwise import cosine_similarity
from typing import Dict, List, Tuple, Any, Optional, Union
from scipy.spatial import distance
from skimage.morphology import skeletonize
from skimage.feature import peak_local_max
import json
import os
import base64
from datetime import datetime
import functools
import time
from cosmos_db import CosmosDBClient
import uuid

class RetinaProcessor:
    """
    Class for processing retina images, extracting features, and comparing them.
    """
    def __init__(self):
        """Initialize the retina processor with default parameters."""
        self.blood_vessel_threshold = 30
        self.similarity_threshold = 0.95  # Threshold for determining if two retinas match
        self.standard_size = (256, 256)  # Reduced standard size for faster processing (was 512x512)
        self.bifurcation_distance_threshold = 10  # Max distance for matching bifurcation points
        self.grid_size = (8, 8)  # Grid size for spatial vessel distribution analysis
        
        # Create directory for storing retina data
        os.makedirs("retina_data", exist_ok=True)
        
        # Feature cache to avoid reprocessing the same images
        self._feature_cache = {}
        self._cache_hits = 0
        self._cache_misses = 0
        
        # Initialize Cosmos DB client
        self.cosmos_client = CosmosDBClient()
    
    # Performance monitoring decorator
    def _time_function(func):
        @functools.wraps(func)
        def wrapper(self, *args, **kwargs):
            start_time = time.time()
            result = func(self, *args, **kwargs)
            end_time = time.time()
            execution_time = end_time - start_time
            func_name = func.__name__
            if execution_time > 0.1:  # Only log slow operations
                print(f"Performance: {func_name} took {execution_time:.4f} seconds")
            return result
        return wrapper
    
    @_time_function
    def preprocess_image(self, image: np.ndarray) -> np.ndarray:
        """
        Preprocess the retina image for feature extraction.
        
        Args:
            image: Input retina image as numpy array
            
        Returns:
            Preprocessed image
        """
        # Resize the image to standard size
        resized = cv2.resize(image, self.standard_size, interpolation=cv2.INTER_AREA)
        
        # Convert to grayscale if it's a color image
        if len(resized.shape) > 2:
            gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
        else:
            gray = resized.copy()
        
        # Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(gray)
        
        # Apply Gaussian blur to reduce noise
        blurred = cv2.GaussianBlur(enhanced, (5, 5), 0)
        
        return blurred
    
    @_time_function
    def extract_blood_vessels(self, image: np.ndarray) -> np.ndarray:
        """
        Extract blood vessels from the retina image.
        
        Args:
            image: Preprocessed retina image
            
        Returns:
            Binary image with blood vessels
        """
        # Apply adaptive thresholding to highlight blood vessels
        thresh = cv2.adaptiveThreshold(
            image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY_INV, 11, 2
        )
        
        # Apply morphological operations to enhance blood vessels
        kernel = np.ones((3, 3), np.uint8)
        opening = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=1)
        
        return opening
    
    @_time_function
    def detect_optic_disc(self, image: np.ndarray) -> Tuple[Optional[Tuple[int, int]], Optional[int]]:
        """
        Detect the optic disc in the retina image.
        
        Args:
            image: Preprocessed retina image
            
        Returns:
            Tuple containing (center_x, center_y) and radius of the optic disc,
            or (None, None) if not detected
        """
        # Apply Hough Circle Transform to detect the optic disc
        circles = cv2.HoughCircles(
            image, cv2.HOUGH_GRADIENT, dp=1, minDist=50,
            param1=50, param2=30, minRadius=10, maxRadius=50  # Adjusted for smaller image size
        )
        
        if circles is not None:
            circles = np.uint16(np.around(circles))
            # Get the most prominent circle (likely the optic disc)
            x, y, r = circles[0, 0]
            return ((x, y), r)
        
        return (None, None)
    
    @_time_function
    def detect_bifurcation_points(self, blood_vessels: np.ndarray) -> List[Tuple[int, int]]:
        """
        Detect bifurcation points in the blood vessel network.
        
        Args:
            blood_vessels: Binary image with blood vessels
            
        Returns:
            List of (x, y) coordinates of bifurcation points
        """
        # Create a skeleton of the blood vessels
        skeleton = skeletonize(blood_vessels > 0).astype(np.uint8) * 255
        
        # Define kernel for detecting bifurcation points
        kernel = np.array([
            [1, 1, 1],
            [1, 10, 1],
            [1, 1, 1]
        ], dtype=np.uint8)
        
        # Apply the kernel to detect junction points
        result = cv2.filter2D(skeleton, -1, kernel)
        
        # Find points with value > 12 (central pixel + at least 3 neighbors)
        # Limit the number of points for faster processing
        max_points = 50
        bifurcation_points = peak_local_max(
            result, min_distance=5, threshold_abs=12, exclude_border=False,
            num_peaks=max_points  # Limit number of points
        )
        
        # Convert to list of (x, y) tuples
        return [(x, y) for y, x in bifurcation_points]
    
    @_time_function
    def analyze_vessel_spatial_distribution(self, blood_vessels: np.ndarray) -> np.ndarray:
        """
        Analyze the spatial distribution of blood vessels using a grid-based approach.
        
        Args:
            blood_vessels: Binary image with blood vessels
            
        Returns:
            Grid-based vessel density histogram
        """
        # Create a grid
        grid_h, grid_w = self.grid_size
        h, w = blood_vessels.shape
        cell_h, cell_w = h // grid_h, w // grid_w
        
        # Calculate vessel density in each grid cell
        grid_densities = np.zeros((grid_h, grid_w))
        
        for i in range(grid_h):
            for j in range(grid_w):
                # Get the cell region
                cell = blood_vessels[i*cell_h:(i+1)*cell_h, j*cell_w:(j+1)*cell_w]
                # Calculate vessel density in this cell
                grid_densities[i, j] = np.sum(cell > 0) / (cell_h * cell_w)
        
        # Flatten the grid to create a feature vector
        return grid_densities.flatten()
    
    def _get_image_hash(self, image: np.ndarray) -> str:
        """
        Generate a hash for an image to use as a cache key.
        
        Args:
            image: Input image
            
        Returns:
            Hash string
        """
        # Resize to tiny image for faster hashing
        tiny = cv2.resize(image, (32, 32))
        # Convert to grayscale if needed
        if len(tiny.shape) > 2:
            tiny = cv2.cvtColor(tiny, cv2.COLOR_BGR2GRAY)
        # Calculate hash
        return str(hash(tiny.tobytes()))
    
    @_time_function
    def extract_features(self, image: np.ndarray) -> Dict[str, Any]:
        """
        Extract features from a retina image.
        
        Args:
            image: Input retina image as numpy array
            
        Returns:
            Dictionary of extracted features
        """
        # Check if we've already processed this image
        image_hash = self._get_image_hash(image)
        if image_hash in self._feature_cache:
            self._cache_hits += 1
            print(f"Cache hit! Hits: {self._cache_hits}, Misses: {self._cache_misses}")
            return self._feature_cache[image_hash]
        
        self._cache_misses += 1
        print(f"Cache miss. Hits: {self._cache_hits}, Misses: {self._cache_misses}")
        
        # Preprocess the image (includes resizing to standard size)
        preprocessed = self.preprocess_image(image)
        
        # Extract blood vessels
        blood_vessels = self.extract_blood_vessels(preprocessed)
        
        # Detect optic disc
        optic_disc_center, optic_disc_radius = self.detect_optic_disc(preprocessed)
        
        # Extract LBP (Local Binary Pattern) features - use smaller number of bins
        lbp_features = local_binary_pattern(preprocessed, P=8, R=1, method='uniform')
        lbp_hist, _ = np.histogram(lbp_features, bins=8, range=(0, 8))  # Reduced from 10 to 8 bins
        lbp_hist = lbp_hist.astype(float)
        lbp_hist /= (lbp_hist.sum() + 1e-7)  # Normalize
        
        # Extract HOG (Histogram of Oriented Gradients) features with reduced complexity
        hog_features = hog(
            preprocessed, orientations=6,  # Reduced from 8
            pixels_per_cell=(32, 32),  # Increased from 16x16
            cells_per_block=(1, 1), visualize=False, feature_vector=True
        )
        
        # Calculate blood vessel density
        blood_vessel_density = np.sum(blood_vessels > 0) / (blood_vessels.shape[0] * blood_vessels.shape[1])
        
        # Extract region properties of blood vessels
        labeled_vessels = cv2.connectedComponents(blood_vessels)[1]
        if np.max(labeled_vessels) > 0:  # Check if any vessels were detected
            props = regionprops(labeled_vessels)
            
            # Calculate average vessel length and width
            if len(props) > 0:
                # Limit the number of props to process for speed
                max_props = min(50, len(props))
                props = props[:max_props]
                
                avg_vessel_length = np.mean([max(prop.major_axis_length, 1) for prop in props if hasattr(prop, 'major_axis_length')])
                avg_vessel_width = np.mean([max(prop.minor_axis_length, 1) for prop in props if hasattr(prop, 'minor_axis_length')])
                vessel_count = len(props)
            else:
                avg_vessel_length = 0
                avg_vessel_width = 0
                vessel_count = 0
        else:
            avg_vessel_length = 0
            avg_vessel_width = 0
            vessel_count = 0
        
        # Detect bifurcation points in blood vessels
        bifurcation_points = self.detect_bifurcation_points(blood_vessels)
        
        # Analyze spatial distribution of blood vessels
        vessel_spatial_distribution = self.analyze_vessel_spatial_distribution(blood_vessels).tolist()
        
        # Generate a unique ID for this feature set
        feature_id = str(uuid.uuid4())
        
        # Compile all features into a dictionary
        features = {
            "id": feature_id,
            "lbp_histogram": lbp_hist.tolist(),
            "hog_features": hog_features.tolist(),
            "blood_vessel_density": float(blood_vessel_density),
            "avg_vessel_length": float(avg_vessel_length),
            "avg_vessel_width": float(avg_vessel_width),
            "vessel_count": int(vessel_count),
            "optic_disc_center": optic_disc_center,
            "optic_disc_radius": optic_disc_radius,
            "bifurcation_points": bifurcation_points,
            "vessel_spatial_distribution": vessel_spatial_distribution,
            "timestamp": datetime.now().isoformat()
        }
        
        # Cache the result
        self._feature_cache[image_hash] = features
        
        # Limit cache size to prevent memory issues
        if len(self._feature_cache) > 100:
            # Remove oldest item (first key)
            oldest_key = next(iter(self._feature_cache))
            del self._feature_cache[oldest_key]
        
        return features
    
    @_time_function
    def compare_features(self, features1: Dict[str, Any], features2: Dict[str, Any]) -> Dict[str, Any]:
        """
        Compare two sets of retina features to determine if they belong to the same person.
        
        Args:
            features1: First set of retina features
            features2: Second set of retina features
            
        Returns:
            Dictionary containing similarity score and match result
        """
        # Convert feature lists to numpy arrays
        lbp_hist1 = np.array(features1["lbp_histogram"]).reshape(1, -1)
        lbp_hist2 = np.array(features2["lbp_histogram"]).reshape(1, -1)
        
        hog_features1 = np.array(features1["hog_features"]).reshape(1, -1)
        hog_features2 = np.array(features2["hog_features"]).reshape(1, -1)
        
        vessel_spatial1 = np.array(features1["vessel_spatial_distribution"]).reshape(1, -1)
        vessel_spatial2 = np.array(features2["vessel_spatial_distribution"]).reshape(1, -1)
        
        # Calculate similarity scores
        lbp_similarity = cosine_similarity(lbp_hist1, lbp_hist2)[0][0]
        hog_similarity = cosine_similarity(hog_features1, hog_features2)[0][0]
        vessel_spatial_similarity = cosine_similarity(vessel_spatial1, vessel_spatial2)[0][0]
        
        # Calculate vessel pattern similarity
        vessel_density_diff = abs(features1["blood_vessel_density"] - features2["blood_vessel_density"])
        vessel_length_diff = abs(features1["avg_vessel_length"] - features2["avg_vessel_length"])
        vessel_width_diff = abs(features1["avg_vessel_width"] - features2["avg_vessel_width"])
        
        # Normalize differences
        vessel_density_similarity = 1 - min(vessel_density_diff, 1)
        vessel_length_similarity = 1 - min(vessel_length_diff / (max(features1["avg_vessel_length"], features2["avg_vessel_length"]) + 1e-7), 1)
        vessel_width_similarity = 1 - min(vessel_width_diff / (max(features1["avg_vessel_width"], features2["avg_vessel_width"]) + 1e-7), 1)
        
        # Compare bifurcation points
        bifurcation_similarity = self.compare_bifurcation_points(
            features1["bifurcation_points"], 
            features2["bifurcation_points"]
        )
        
        # Calculate weighted average similarity
        weights = {
            "lbp": 0.2,
            "hog": 0.2,
            "vessel_density": 0.1,
            "vessel_length": 0.1,
            "vessel_width": 0.05,
            "bifurcation_points": 0.2,
            "vessel_spatial": 0.15
        }
        
        overall_similarity = (
            weights["lbp"] * lbp_similarity +
            weights["hog"] * hog_similarity +
            weights["vessel_density"] * vessel_density_similarity +
            weights["vessel_length"] * vessel_length_similarity +
            weights["vessel_width"] * vessel_width_similarity +
            weights["bifurcation_points"] * bifurcation_similarity +
            weights["vessel_spatial"] * vessel_spatial_similarity
        )
        
        # Determine if the retinas match
        is_match = overall_similarity >= self.similarity_threshold
        
        return {
            "overall_similarity": float(overall_similarity),
            "lbp_similarity": float(lbp_similarity),
            "hog_similarity": float(hog_similarity),
            "vessel_density_similarity": float(vessel_density_similarity),
            "vessel_length_similarity": float(vessel_length_similarity),
            "vessel_width_similarity": float(vessel_width_similarity),
            "bifurcation_similarity": float(bifurcation_similarity),
            "vessel_spatial_similarity": float(vessel_spatial_similarity),
            "is_match": bool(is_match)
        }
    
    @_time_function
    def compare_bifurcation_points(self, points1: List[Tuple[int, int]], points2: List[Tuple[int, int]]) -> float:
        """
        Compare two sets of bifurcation points to calculate similarity.
        
        Args:
            points1: First set of bifurcation points
            points2: Second set of bifurcation points
            
        Returns:
            Similarity score between 0 and 1
        """
        if not points1 or not points2:
            return 0.0
        
        # Limit the number of points for faster comparison
        max_points = 30
        points1 = points1[:max_points]
        points2 = points2[:max_points]
        
        # Convert to numpy arrays for easier processing
        points1_array = np.array(points1)
        points2_array = np.array(points2)
        
        # Calculate the minimum number of points to match
        min_points = min(len(points1), len(points2))
        max_points = max(len(points1), len(points2))
        
        if min_points == 0:
            return 0.0
        
        # Calculate distances between all pairs of points
        distances = distance.cdist(points1_array, points2_array, 'euclidean')
        
        # Count how many points are matched (have a corresponding point within threshold)
        matched_count = 0
        
        # Greedy matching algorithm
        while distances.size > 0 and np.min(distances) < self.bifurcation_distance_threshold:
            # Find the closest pair
            min_idx = np.unravel_index(np.argmin(distances), distances.shape)
            
            # Mark this pair as matched
            matched_count += 1
            
            # Remove the matched points from consideration
            distances = np.delete(distances, min_idx[0], axis=0)
            if distances.size > 0:  # Check if distances is not empty
                distances = np.delete(distances, min_idx[1], axis=1)
            
            # Break if no more points to match
            if distances.size == 0:
                break
        
        # Calculate similarity as the ratio of matched points to the maximum number of points
        similarity = matched_count / max_points if max_points > 0 else 0.0
        
        return similarity
    
    def _convert_numpy_types(self, obj: Any) -> Any:
        """
        Convert NumPy types to native Python types for JSON serialization.
        
        Args:
            obj: Object that may contain NumPy types
            
        Returns:
            Object with NumPy types converted to native Python types
        """
        # Handle NumPy arrays
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        
        # Handle NumPy numeric types
        if isinstance(obj, (np.int8, np.int16, np.int32, np.int64,
                           np.uint8, np.uint16, np.uint32, np.uint64)):
            return int(obj)
        
        if isinstance(obj, (np.float16, np.float32, np.float64)):
            return float(obj)
        
        if isinstance(obj, (np.bool_)):
            return bool(obj)
        
        # Handle dictionaries
        if isinstance(obj, dict):
            return {key: self._convert_numpy_types(value) for key, value in obj.items()}
        
        # Handle lists and tuples
        if isinstance(obj, (list, tuple)):
            return [self._convert_numpy_types(item) for item in obj]
        
        # Return other types as is
        return obj

    def batch_export_features(self, features_list: List[Dict[str, Any]], person_id: str = None) -> List[str]:
        """
        Export multiple retina feature sets to Cosmos DB.
        
        Args:
            features_list: List of feature dictionaries
            person_id: Optional person ID to associate with the features
            
        Returns:
            List of Cosmos DB IDs for the stored features
        """
        cosmos_ids = []
        
        for i, features in enumerate(features_list):
            # Add export timestamp and batch index
            export_data = features.copy()
            export_data["export_timestamp"] = datetime.now().isoformat()
            export_data["batch_index"] = i
            
            if person_id:
                export_data["person_id"] = person_id
            
            # Convert NumPy types to native Python types for JSON serialization
            export_data = self._convert_numpy_types(export_data)
            
            # Store in Cosmos DB
            if hasattr(self, 'cosmos_client') and self.cosmos_client.is_connected():
                cosmos_result = self.cosmos_client.store_features(export_data, person_id)
                if cosmos_result and 'id' in cosmos_result:
                    cosmos_ids.append(cosmos_result['id'])
        
        return cosmos_ids
    
    def import_features_from_json(self, filepath: str) -> Dict[str, Any]:
        """
        Import retina features from a JSON file.
        
        Args:
            filepath: Path to the JSON file
            
        Returns:
            Dictionary of retina features
        """
        with open(filepath, 'r') as f:
            features = json.load(f)
        
        return features
    
    def export_features_to_json(self, features: Dict[str, Any], filename: str = None, person_id: str = None) -> str:
        """
        Export extracted features to Cosmos DB.
        
        Args:
            features: Dictionary of extracted features
            filename: Optional filename (not used, kept for compatibility)
            person_id: Optional person ID to associate with the features
            
        Returns:
            Cosmos DB ID if successful, None otherwise
        """
        # Add person_id to the export data if provided
        export_data = features.copy()
        if person_id:
            export_data['person_id'] = person_id
        
        # Convert NumPy types to native Python types for JSON serialization
        export_data = self._convert_numpy_types(export_data)
        
        # Store in Cosmos DB if connected
        cosmos_id = None
        if hasattr(self, 'cosmos_client') and self.cosmos_client.is_connected():
            cosmos_result = self.cosmos_client.store_features(export_data, person_id)
            if cosmos_result and 'id' in cosmos_result:
                cosmos_id = cosmos_result['id']
        
        return cosmos_id
