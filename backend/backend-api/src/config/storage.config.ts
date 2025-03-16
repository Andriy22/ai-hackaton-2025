import { registerAs } from '@nestjs/config';

/**
 * Configuration for Azure Blob Storage
 */
export const storageConfig = registerAs('storage', () => ({
  /**
   * Azure Storage connection string
   */
  connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  
  /**
   * Azure Storage container name for retina images
   */
  containerName: process.env.AZURE_STORAGE_CONTAINER_NAME || 'retinas',
}));
