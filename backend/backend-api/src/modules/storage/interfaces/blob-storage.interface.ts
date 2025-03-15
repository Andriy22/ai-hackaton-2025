/**
 * Interface defining the contract for blob storage operations
 */
export interface IBlobStorage {
  /**
   * Upload an image to blob storage
   * @param blobName - Name to identify the blob
   * @param content - Buffer or string content of the image
   * @param contentType - MIME type of the image
   * @returns URL of the uploaded image
   */
  uploadImage(
    blobName: string,
    content: Buffer | string,
    contentType: string,
  ): Promise<string>;

  /**
   * Download an image from blob storage
   * @param blobName - Name of the blob to download
   * @returns Buffer containing the image data
   */
  downloadImage(blobName: string): Promise<Buffer>;

  /**
   * Get the URL for a blob
   * @param blobName - Name of the blob
   * @returns URL of the blob
   */
  getBlobUrl(blobName: string): string;

  /**
   * List all blobs in the container
   * @returns Array of blob names
   */
  listBlobs(): Promise<string[]>;

  /**
   * Delete a blob from storage
   * @param blobName - Name of the blob to delete
   * @returns Boolean indicating success
   */
  deleteBlob(blobName: string): Promise<boolean>;
}
