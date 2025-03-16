import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  ServiceBusClient,
  ServiceBusMessage,
  ServiceBusReceiver,
  ServiceBusReceivedMessage,
} from '@azure/service-bus';
import { RetinaImageRepository } from '../repositories/retina-image.repository';

/**
 * Interface for retina image response from the service bus
 */
interface RetinaImageResponse {
  status: string;
  id: string; // cosmos_id
  employeeId: string;
  originalImage: string; // blob_path
  imgId: string; // fileId
}

/**
 * Service for receiving and processing messages from Azure Service Bus
 */
@Injectable()
export class ServiceBusReceiverService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(ServiceBusReceiverService.name);
  private readonly serviceBusClient: ServiceBusClient | null = null;
  private readonly responseQueueName: string;
  private receiver: ServiceBusReceiver | null = null;
  private isProcessing = false;
  private instanceId: string;
  private processedMessageIds = new Set<string>();

  /**
   * Constructor for ServiceBusReceiverService
   * @param retinaImageRepository - Repository for retina images
   */
  constructor(private readonly retinaImageRepository: RetinaImageRepository) {
    // Generate a unique instance ID to help with distributed processing
    this.instanceId = `instance-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    this.logger.log(`Service Bus Receiver instance ID: ${this.instanceId}`);

    try {
      const connectionString = process.env.AZURE_SERVICE_BUS_CONNECTION_STRING;
      this.responseQueueName =
        process.env.AZURE_SERVICE_BUS_RESPONSE_QUEUE_NAME ||
        'retina-analysis-response-queue';

      if (connectionString) {
        // Create the Service Bus client with proper typing
        this.serviceBusClient = new ServiceBusClient(connectionString);
        this.logger.log(
          `ServiceBusReceiverService initialized successfully for queue: ${this.responseQueueName}`,
        );
      } else {
        this.logger.warn(
          'Azure Service Bus connection string is not defined. Service Bus receiver functionality will be disabled.',
        );
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to initialize ServiceBusReceiverService: ${errorMessage}`,
      );
    }
  }

  /**
   * Initialize the service bus receiver when the module starts
   */
  async onModuleInit(): Promise<void> {
    await this.startReceiver();

    // Perform an initial check for messages in the queue
    await this.checkForExistingMessages();
  }

  /**
   * Check for existing messages in the queue
   * This helps process messages that might have been sent before the receiver was started
   */
  private async checkForExistingMessages(): Promise<void> {
    if (!this.serviceBusClient || !this.receiver) {
      return;
    }

    try {
      this.logger.log(
        `Checking for existing messages in queue: ${this.responseQueueName}`,
      );

      // Peek at messages in the queue
      const messages = await this.receiver.peekMessages(10);

      if (messages.length > 0) {
        this.logger.log(
          `Found ${messages.length} existing messages in the queue`,
        );

        // Log details about the messages
        messages.forEach((message, index) => {
          this.logger.log(
            `Message ${index + 1} - ID: ${message.messageId || 'unknown'}, EnqueuedTime: ${message.enqueuedTimeUtc}`,
          );
        });
      } else {
        this.logger.log('No existing messages found in the queue');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to check for existing messages: ${errorMessage}`,
      );
    }
  }

  /**
   * Start the service bus receiver to process response messages
   */
  private async startReceiver(): Promise<void> {
    if (!this.serviceBusClient) {
      this.logger.warn(
        'Service Bus client is not initialized. Receiver not started.',
      );
      return;
    }

    try {
      // Log the queue name we're connecting to
      this.logger.log(
        `Attempting to connect to queue: ${this.responseQueueName}`,
      );

      // Close any existing receiver to ensure a clean start
      if (this.receiver) {
        await this.receiver.close();
        this.logger.log('Closed existing receiver before creating a new one');
      }

      // Create the receiver with correct options
      this.receiver = this.serviceBusClient.createReceiver(
        this.responseQueueName,
        {
          receiveMode: 'peekLock',
          maxAutoLockRenewalDurationInMs: 300000, // 5 minutes
        },
      );

      // Subscribe to messages with more detailed logging
      this.receiver.subscribe({
        processMessage: async (message) => {
          await this.handleMessage(message);
        },
        processError: async (error) => {
          this.logger.error(
            `Error processing message: ${JSON.stringify(error)}`,
          );
        },
      });

      this.logger.log(
        `Started listening for messages on queue: ${this.responseQueueName}`,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to start Service Bus receiver: ${errorMessage}`,
      );

      // Log the stack trace if available
      if (error instanceof Error && error.stack) {
        this.logger.error(`Stack trace: ${error.stack}`);
      }

      // Attempt to restart the receiver after a delay
      setTimeout(() => this.startReceiver(), 10000);
    }
  }

  /**
   * Handle an incoming message with distributed processing protection
   * @param message - The received message
   */
  private async handleMessage(
    message: ServiceBusReceivedMessage,
  ): Promise<void> {
    const messageId = message.messageId || 'unknown';

    // Check if we've already processed this message
    if (this.processedMessageIds.has(messageId.toString())) {
      this.logger.log(
        `Message ${messageId} already processed by this instance, skipping`,
      );
      await this.receiver?.completeMessage(message);
      return;
    }

    // Check if we're already processing a message
    if (this.isProcessing) {
      this.logger.log(
        `Instance ${this.instanceId} is busy, deferring message ${messageId}`,
      );
      try {
        // Defer the message to be processed later
        await this.receiver?.deferMessage(message);
        this.logger.log(`Deferred message ${messageId} for later processing`);
      } catch (deferError) {
        this.logger.error(
          `Failed to defer message: ${JSON.stringify(deferError)}`,
        );
      }
      return;
    }

    try {
      // Set processing flag to prevent concurrent processing
      this.isProcessing = true;
      this.logger.log(
        `Processing message ${messageId} on instance ${this.instanceId}`,
      );

      // Process the message
      await this.processResponseMessage(message);

      // Mark as processed
      this.processedMessageIds.add(messageId.toString());

      // Limit the size of the processed set to avoid memory leaks
      if (this.processedMessageIds.size > 1000) {
        // Remove the oldest entries
        const entriesToRemove = this.processedMessageIds.size - 1000;
        const iterator = this.processedMessageIds.values();
        for (let i = 0; i < entriesToRemove; i++) {
          const value = iterator.next().value;
          if (typeof value === 'string') {
            this.processedMessageIds.delete(value);
          }
        }
      }

      // Complete the message
      try {
        await this.receiver?.completeMessage(message);
        this.logger.log(`Completed message ${messageId}`);
      } catch (completeError) {
        this.logger.error(
          `Failed to complete message: ${JSON.stringify(completeError)}`,
        );
      }
    } finally {
      // Reset processing flag
      this.isProcessing = false;
    }
  }

  /**
   * Process a response message from the service bus
   * @param message - Service bus message containing retina image response
   */
  private async processResponseMessage(
    message: ServiceBusReceivedMessage,
  ): Promise<void> {
    try {
      // Log the raw message for debugging
      this.logger.log(`Raw message received: ${JSON.stringify(message.body)}`);

      // Check if message body is defined
      if (!message.body) {
        this.logger.warn('Received message with empty body');
        return;
      }

      const response = message.body as RetinaImageResponse;

      // Validate required fields are present
      if (!response.employeeId || !response.imgId) {
        this.logger.warn(
          `Invalid message format: Missing required fields. Message: ${JSON.stringify(response)}`,
        );
        return;
      }

      this.logger.log(
        `Received response message for employee ${response.employeeId}, image ${response.imgId}`,
      );

      // Log the response message for debugging
      this.logger.log(`Response message: ${JSON.stringify(response)}`);

      if (response.status === 'success' && response.id && response.imgId) {
        // Update the retina image record with the document ID
        const updatedImage = await this.retinaImageRepository.updateDocumentId(
          response.imgId,
          response.id,
        );

        if (updatedImage) {
          this.logger.log(
            `Updated retina image ${response.imgId} with document ID ${response.id}`,
          );
        } else {
          this.logger.warn(
            `Failed to update retina image ${response.imgId}: Record not found`,
          );
        }
      } else {
        this.logger.warn(
          `Invalid response message format or status: ${JSON.stringify(response)}`,
        );
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to process response message: ${errorMessage}`);

      // Log the stack trace if available
      if (error instanceof Error && error.stack) {
        this.logger.error(`Stack trace: ${error.stack}`);
      }
    }
  }

  /**
   * Close the service bus client when the module is destroyed
   */
  async onModuleDestroy(): Promise<void> {
    await this.close();
  }

  /**
   * Close the service bus client and receiver
   */
  private async close(): Promise<void> {
    try {
      if (this.receiver) {
        await this.receiver.close();
        this.logger.log('Service Bus receiver closed successfully');
      }

      if (this.serviceBusClient) {
        await this.serviceBusClient.close();
        this.logger.log('Service Bus client closed successfully');
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to close Service Bus client: ${errorMessage}`);
    }
  }
}
