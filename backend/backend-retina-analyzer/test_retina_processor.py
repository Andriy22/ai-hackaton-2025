"""
Test script for the retina processor.
This script demonstrates how to use the RetinaProcessor class to process and compare retina images.
"""
import cv2
import numpy as np
import matplotlib.pyplot as plt
from retina_processor import RetinaProcessor
import os
import argparse

def display_results(image1, image2, features1, features2, comparison_result):
    """
    Display the processing results for two retina images.
    
    Args:
        image1: First retina image
        image2: Second retina image
        features1: Features extracted from the first image
        features2: Features extracted from the second image
        comparison_result: Result of comparing the two images
    """
    # Create a figure with subplots
    fig, axs = plt.subplots(2, 3, figsize=(15, 10))
    
    # Display original images
    axs[0, 0].imshow(cv2.cvtColor(image1, cv2.COLOR_BGR2RGB))
    axs[0, 0].set_title('Image 1')
    axs[0, 0].axis('off')
    
    axs[1, 0].imshow(cv2.cvtColor(image2, cv2.COLOR_BGR2RGB))
    axs[1, 0].set_title('Image 2')
    axs[1, 0].axis('off')
    
    # Create processor for visualization
    processor = RetinaProcessor()
    
    # Process and display blood vessels
    preprocessed1 = processor.preprocess_image(image1)
    blood_vessels1 = processor.extract_blood_vessels(preprocessed1)
    axs[0, 1].imshow(blood_vessels1, cmap='gray')
    axs[0, 1].set_title('Blood Vessels 1')
    axs[0, 1].axis('off')
    
    preprocessed2 = processor.preprocess_image(image2)
    blood_vessels2 = processor.extract_blood_vessels(preprocessed2)
    axs[1, 1].imshow(blood_vessels2, cmap='gray')
    axs[1, 1].set_title('Blood Vessels 2')
    axs[1, 1].axis('off')
    
    # Display feature histograms
    lbp_hist1 = np.array(features1["lbp_histogram"])
    lbp_hist2 = np.array(features2["lbp_histogram"])
    
    axs[0, 2].bar(range(len(lbp_hist1)), lbp_hist1)
    axs[0, 2].set_title('LBP Histogram 1')
    
    axs[1, 2].bar(range(len(lbp_hist2)), lbp_hist2)
    axs[1, 2].set_title('LBP Histogram 2')
    
    # Add comparison results as text
    is_match = comparison_result["is_match"]
    similarity = comparison_result["overall_similarity"]
    
    match_text = f"MATCH: {is_match}\nSimilarity: {similarity:.4f}"
    fig.text(0.5, 0.02, match_text, ha='center', fontsize=14, 
             bbox=dict(facecolor='green' if is_match else 'red', alpha=0.5))
    
    # Display the plot
    plt.tight_layout()
    plt.subplots_adjust(bottom=0.15)
    plt.show()

def main():
    """Main function to test the retina processor."""
    parser = argparse.ArgumentParser(description='Test the retina processor with two images')
    parser.add_argument('--image1', required=True, help='Path to the first retina image')
    parser.add_argument('--image2', required=True, help='Path to the second retina image')
    args = parser.parse_args()
    
    # Check if the image files exist
    if not os.path.exists(args.image1):
        print(f"Error: Image file {args.image1} does not exist")
        return
    
    if not os.path.exists(args.image2):
        print(f"Error: Image file {args.image2} does not exist")
        return
    
    # Load the images
    image1 = cv2.imread(args.image1)
    image2 = cv2.imread(args.image2)
    
    if image1 is None:
        print(f"Error: Could not read image file {args.image1}")
        return
    
    if image2 is None:
        print(f"Error: Could not read image file {args.image2}")
        return
    
    # Initialize the retina processor
    processor = RetinaProcessor()
    
    # Extract features from both images
    print("Extracting features from image 1...")
    features1 = processor.extract_features(image1)
    
    print("Extracting features from image 2...")
    features2 = processor.extract_features(image2)
    
    # Compare the features
    print("Comparing features...")
    comparison_result = processor.compare_features(features1, features2)
    
    # Print the comparison results
    print("\nComparison Results:")
    print(f"Overall Similarity: {comparison_result['overall_similarity']:.4f}")
    print(f"LBP Similarity: {comparison_result['lbp_similarity']:.4f}")
    print(f"HOG Similarity: {comparison_result['hog_similarity']:.4f}")
    print(f"Vessel Density Similarity: {comparison_result['vessel_density_similarity']:.4f}")
    print(f"Vessel Length Similarity: {comparison_result['vessel_length_similarity']:.4f}")
    print(f"Vessel Width Similarity: {comparison_result['vessel_width_similarity']:.4f}")
    print(f"Is Match: {comparison_result['is_match']}")
    
    # Display the results
    display_results(image1, image2, features1, features2, comparison_result)

if __name__ == "__main__":
    main()
