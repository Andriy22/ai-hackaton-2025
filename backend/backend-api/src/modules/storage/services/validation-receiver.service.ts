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
import { EventEmitter2 } from '@nestjs/event-emitter';

/**
 * Interface for retina validation response from the service bus
 */
export interface RetinaValidationResponse {
  status: string;
  matchingEmployeeId: string | null;
  similarity: number;
  messageId: string;
  originatingInstance?: string;
}

/**
 * Service for receiving and processing validation messages from Azure Service Bus
 */
@Injectable()
export class ValidationReceiverService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(ValidationReceiverService.name);
  private readonly serviceBusClient: ServiceBusClient | null = null;
  private readonly validationResponseQueueName: string;
  private receiver: ServiceBusReceiver | null = null;
  private readonly validationResponses = new Map<
    string,
    RetinaValidationResponse
  >();
  private isProcessing = false;
  private instanceId: string;
  private processedMessageIds = new Set<string>();
  private readonly port: string;

  /**
   * Constructor for ValidationReceiverService
   * @param eventEmitter - Event emitter for publishing validation responses
   */
  constructor(private readonly eventEmitter: EventEmitter2) {
    // Generate a unique instance ID that includes the port number for traceability
    this.port = process.env.PORT || '3000';
    this.instanceId = `validation-instance-port-${this.port}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    this.logger.log(`Validation Receiver instance ID: ${this.instanceId} on port ${this.port}`);
    
    try {
      const connectionString = process.env.AZURE_SERVICE_BUS_CONNECTION_STRING;
      
      // Use a separate queue for validation responses
      this.validationResponseQueueName =
        process.env.AZURE_SERVICE_BUS_VALIDATION_RESPONSE_QUEUE_NAME ||
        'retina-validation-response-queue';
      
      this.logger.log(`Using validation response queue: ${this.validationResponseQueueName}`);

      if (connectionString) {
        this.serviceBusClient = new ServiceBusClient(connectionString);
        this.logger.log('ValidationReceiverService initialized successfully');
      } else {
        this.logger.warn(
          'Azure Service Bus connection string is not defined. Validation receiver functionality will be disabled.',
        );
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to initialize ValidationReceiverService: ${errorMessage}`,
      );
    }
  }

  /**
   * Initialize the service bus receiver when the module starts
   */
  async onModuleInit(): Promise<void> {
    await this.startReceiver();
  }

  /**
   * Close the service bus client when the module is destroyed
   */
  async onModuleDestroy(): Promise<void> {
    await this.close();
  }

  /**
   * Start the service bus receiver to process validation response messages
   */
  private async startReceiver(): Promise<void> {
    if (!this.serviceBusClient) {
      this.logger.warn(
        'Service Bus client is not initialized. Validation receiver not started.',
      );
      return;
    }

    try {
      this.logger.log(
        `Attempting to connect to validation response queue: ${this.validationResponseQueueName}`,
      );

      // Close any existing receiver to ensure a clean start
      if (this.receiver) {
        await this.receiver.close();
        this.logger.log('Closed existing validation receiver before creating a new one');
      }

      // Create the receiver with correct options
      this.receiver = this.serviceBusClient.createReceiver(
        this.validationResponseQueueName,
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
            `Error processing validation message: ${JSON.stringify(error)}`,
          );
        },
      });

      this.logger.log(
        `Started listening for validation messages on queue: ${this.validationResponseQueueName}`,
      );
      
      // Perform an initial check for messages in the queue
      await this.checkForExistingMessages();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to start validation Service Bus receiver: ${errorMessage}`,
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
   * Check for existing messages in the queue
   * This helps process messages that might have been sent before the receiver was started
   */
  private async checkForExistingMessages(): Promise<void> {
    if (!this.serviceBusClient || !this.receiver) {
      return;
    }
    
    try {
      this.logger.log(`Checking for existing messages in validation queue: ${this.validationResponseQueueName}`);
      
      // Peek at messages in the queue
      const messages = await this.receiver.peekMessages(10);
      
      if (messages.length > 0) {
        this.logger.log(`Found ${messages.length} existing validation messages in the queue`);
        
        // Log details about the messages
        messages.forEach((message, index) => {
          this.logger.log(`Validation message ${index + 1} - ID: ${message.messageId || 'unknown'}, EnqueuedTime: ${message.enqueuedTimeUtc}`);
        });
      } else {
        this.logger.log('No existing validation messages found in the queue');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to check for existing validation messages: ${errorMessage}`);
    }
  }
  
  /**
   * Handle an incoming message with distributed processing protection
   * @param message - The received message
   */
  private async handleMessage(message: ServiceBusReceivedMessage): Promise<void> {
    const messageId = message.messageId || 'unknown';
    
    // Check if this message has application properties with routing information
    const originatingInstance = message.applicationProperties?.originatingInstance as string;
    const originatingPort = message.applicationProperties?.originatingPort as string;
    
    // Check if the message was intended for a specific instance
    if (originatingInstance && originatingInstance !== this.instanceId) {
      // This message was intended for another instance
      this.logger.log(
        `Message ${messageId} was intended for instance ${originatingInstance} on port ${originatingPort || 'unknown'}, ` +
        `but received by instance ${this.instanceId} on port ${this.port}. ` +
        `Will process anyway but log the mismatch.`
      );
      
      // We'll still process it, but we've logged the mismatch for debugging
    }
    
    // Check if we've already processed this message
    if (this.processedMessageIds.has(messageId.toString())) {
      this.logger.log(`Validation message ${messageId} already processed by this instance, skipping`);
      try {
        await this.receiver?.completeMessage(message);
      } catch (completeError) {
        this.logger.error(`Failed to complete already processed message: ${JSON.stringify(completeError)}`);
      }
      return;
    }
    
    // Check if we're already processing a message
    if (this.isProcessing) {
      this.logger.log(`Validation instance ${this.instanceId} is busy, deferring message ${messageId}`);
      try {
        // Defer the message to be processed later
        await this.receiver?.deferMessage(message);
        this.logger.log(`Deferred validation message ${messageId} for later processing`);
      } catch (deferError) {
        this.logger.error(`Failed to defer validation message: ${JSON.stringify(deferError)}`);
      }
      return;
    }
    
    try {
      // Set processing flag to prevent concurrent processing
      this.isProcessing = true;
      this.logger.log(`Processing validation message ${messageId} on instance ${this.instanceId}`);
      
      // Process the message
      await this.processValidationResponse(message);
      
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
        this.logger.log(`Completed validation message ${messageId}`);
      } catch (completeError) {
        this.logger.error(`Failed to complete validation message: ${JSON.stringify(completeError)}`);
      }
    } finally {
      // Reset processing flag
      this.isProcessing = false;
    }
  }

  /**
   * Process a validation response message from the service bus
   * @param message - Service bus message containing retina validation response
   */
  private async processValidationResponse(
    message: ServiceBusReceivedMessage,
  ): Promise<void> {
    try {
      const response = message.body as RetinaValidationResponse;
      const messageId = response.messageId;

      // Get the originating instance from application properties
      const originatingInstance = message.applicationProperties?.originatingInstance as string;
      const originatingPort = message.applicationProperties?.originatingPort as string;
      
      // Add the originating instance to the response if available
      if (originatingInstance) {
        response.originatingInstance = originatingInstance;
      }

      this.logger.log(
        `Received validation response message for messageId ${messageId}` +
        (originatingInstance ? ` from instance ${originatingInstance} on port ${originatingPort || 'unknown'}` : '')
      );

      if (response.status === 'success' && messageId) {
        // Store the response and emit an event
        this.validationResponses.set(messageId, response);
        this.eventEmitter.emit('validation.response', response);

        this.logger.log(
          `Processed validation response for messageId ${messageId}` +
          (originatingInstance ? ` from instance ${originatingInstance}` : '')
        );
      } else {
        this.logger.warn(
          `Invalid validation response message format or status: ${JSON.stringify(response)}`
        );
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to process validation response message: ${errorMessage}`
      );
    }
  }

  /**
   * Get a validation response by message ID
   * @param messageId - Message ID to get the response for
   * @returns The validation response or null if not found
   */
  getValidationResponse(
    messageId: string,
  ): RetinaValidationResponse | undefined {
    return this.validationResponses.get(messageId);
  }

  /**
   * Wait for a validation response for a specific message ID
   * @param messageId - Message ID to wait for
   * @param timeoutMs - Timeout in milliseconds
   * @returns The validation response or null if timeout
   */
  async waitForValidationResponse(
    messageId: string,
    timeoutMs = 30000,
  ): Promise<RetinaValidationResponse | null> {
    // Check if we already have the response
    const existingResponse = this.validationResponses.get(messageId);
    if (existingResponse) {
      return existingResponse;
    }

    // Wait for the response with a timeout
    return new Promise<RetinaValidationResponse | null>((resolve) => {
      const timeoutId = setTimeout(() => {
        // Remove the listener and resolve with null if timeout
        this.eventEmitter.removeListener(
          'validation.response',
          responseHandler,
        );
        resolve(null);
      }, timeoutMs);

      // Handler for the validation response event
      const responseHandler = (response: RetinaValidationResponse) => {
        if (response.messageId === messageId) {
          // Clear the timeout and resolve with the response
          clearTimeout(timeoutId);
          this.eventEmitter.removeListener(
            'validation.response',
            responseHandler,
          );
          resolve(response);
        }
      };

      // Listen for the validation response event
      this.eventEmitter.on('validation.response', responseHandler);
    });
  }

  /**
   * Close the service bus client connection
   */
  async close(): Promise<void> {
    try {
      if (this.receiver) {
        await this.receiver.close();
        this.logger.log('Validation Service Bus receiver closed successfully');
      }

      if (this.serviceBusClient) {
        await this.serviceBusClient.close();
        this.logger.log('Validation Service Bus client closed successfully');
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to close Validation Service Bus client: ${errorMessage}`,
      );
    }
  }
}
