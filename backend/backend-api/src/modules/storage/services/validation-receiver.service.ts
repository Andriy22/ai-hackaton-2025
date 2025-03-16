/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-misused-promises */

import {
  ServiceBusClient,
  ServiceBusReceivedMessage,
  ServiceBusReceiver,
} from '@azure/service-bus';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

/**
 * Interface for retina validation response from the service bus
 */
export interface RetinaValidationResponse {
  status: string;
  matchingEmployeeId: string | null;
  similarity: number;
  messageId?: string;
  originatingInstance?: string;
}

/**
 * Type for message body to ensure type safety
 */
interface MessageBody {
  status?: string;
  matchingEmployeeId?: string | null;
  similarity?: number;
  messageId?: string;
  response?: Record<string, unknown>;
  [key: string]: unknown;
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
  private isProcessing = false;
  private readonly port: string;
  private isListening = false;

  /**
   * Constructor for ValidationReceiverService
   * @param eventEmitter - Event emitter for publishing validation responses
   */
  constructor(private readonly eventEmitter: EventEmitter2) {
    this.port = process.env.PORT || '3000';
    this.logger.log(`Validation Receiver initialized on port ${this.port}`);

    try {
      const connectionString = process.env.AZURE_SERVICE_BUS_CONNECTION_STRING;

      // Use a separate queue for validation responses
      this.validationResponseQueueName =
        process.env.AZURE_SERVICE_BUS_VALIDATION_RESPONSE_QUEUE_NAME ||
        'retina-validation-response-queue';

      this.logger.log(
        `Using validation response queue: ${this.validationResponseQueueName}`,
      );

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
   * This will set up a continuous listener that doesn't need to be recreated
   */
  private async startReceiver(): Promise<void> {
    if (!this.serviceBusClient) {
      this.logger.warn(
        'Service Bus client is not initialized. Validation receiver not started.',
      );
      return;
    }

    // Don't start if already listening
    if (this.isListening) {
      this.logger.log('Receiver is already listening for messages');
      return;
    }

    try {
      this.logger.log(
        `Connecting to validation response queue: ${this.validationResponseQueueName}`,
      );

      // Close any existing receiver to ensure a clean start
      if (this.receiver) {
        await this.receiver.close();
        this.logger.log(
          'Closed existing validation receiver before creating a new one',
        );
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
        processMessage: async (message: ServiceBusReceivedMessage) => {
          this.logger.log('Message received from service bus queue');
          await this.handleMessage(message);
        },
        processError: async (error: unknown) => {
          this.logger.error(
            `Error processing validation message: ${
              error instanceof Error ? error.message : JSON.stringify(error)
            }`,
          );

          // Only attempt to restart if we were previously listening
          if (this.isListening) {
            this.isListening = false;

            // Attempt to restart the receiver after a delay if there's an error
            setTimeout(() => {
              this.logger.log('Attempting to restart the receiver after error');
              this.startReceiver().catch((e: unknown) => {
                this.logger.error(
                  `Failed to restart receiver: ${
                    e instanceof Error ? e.message : String(e)
                  }`,
                );
              });
            }, 5000);
          }
        },
      });

      this.isListening = true;
      this.logger.log(
        `Started continuous listener for validation messages on queue: ${this.validationResponseQueueName}`,
      );

      // Perform an initial check for messages in the queue
      await this.checkForExistingMessages();
    } catch (error: unknown) {
      this.isListening = false;
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
    if (!this.serviceBusClient) {
      this.logger.warn(
        'Cannot check for existing messages - client not initialized',
      );
      return;
    }

    try {
      this.logger.log(
        `Checking for existing messages in validation queue: ${this.validationResponseQueueName}`,
      );

      // Create a temporary receiver if the main one isn't available
      const tempReceiver = !this.receiver
        ? this.serviceBusClient.createReceiver(
            this.validationResponseQueueName,
            { receiveMode: 'peekLock' },
          )
        : this.receiver;

      // Peek at messages in the queue
      const messages = await tempReceiver.peekMessages(20);

      if (messages.length > 0) {
        this.logger.log(
          `Found ${messages.length} existing validation messages in the queue`,
        );

        // Process each message
        for (const [index, message] of messages.entries()) {
          this.logger.log(
            `Processing validation message ${index + 1}, EnqueuedTime: ${message.enqueuedTimeUtc}`,
          );

          // Process the message directly if it has a valid body
          if (message.body && typeof message.body === 'object') {
            try {
              await this.processValidationResponse(message);
            } catch (processError) {
              this.logger.error(
                `Error processing peeked message: ${
                  processError instanceof Error
                    ? processError.message
                    : JSON.stringify(processError)
                }`,
              );
            }
          }
        }
      } else {
        this.logger.log('No existing validation messages found in the queue');
      }

      // Close the temporary receiver if we created one
      if (tempReceiver !== this.receiver) {
        await tempReceiver.close();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to check for existing validation messages: ${errorMessage}`,
      );

      // Log stack trace if available
      if (error instanceof Error && error.stack) {
        this.logger.error(`Stack trace: ${error.stack}`);
      }
    }
  }

  /**
   * Handle an incoming message
   * @param message - The received message
   */
  async handleMessage(message: ServiceBusReceivedMessage): Promise<void> {
    if (!this.receiver) {
      this.logger.error('Cannot handle message - receiver not initialized');
      return;
    }

    // Check if we're already processing a message
    if (this.isProcessing) {
      this.logger.warn(
        `Already processing a message. Will abandon message to allow retry.`,
      );
      await this.receiver.abandonMessage(message);
      return;
    }

    // Set processing flag
    this.isProcessing = true;

    try {
      // Process the message
      await this.processValidationResponse(message);
      // Complete the message to remove it from the queue
      await this.receiver.completeMessage(message);
      this.logger.log('Message processed and completed');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Error processing message: ${errorMessage}`);

      // Abandon the message so it can be retried
      try {
        this.logger.log('Abandoning message due to error');
        await this.receiver.abandonMessage(message);
      } catch (abandonError) {
        this.logger.error(
          `Failed to abandon message: ${
            abandonError instanceof Error
              ? abandonError.message
              : String(abandonError)
          }`,
        );
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
      const body = message.body as MessageBody | null;
      if (!body || typeof body !== 'object') {
        this.logger.warn(
          `Invalid message body format: ${JSON.stringify(body)}`,
        );
        return;
      }

      // Extract message ID if available (for correlation purposes)
      const messageId =
        typeof message.messageId === 'string'
          ? message.messageId
          : typeof body === 'object' &&
              'messageId' in body &&
              typeof body.messageId === 'string'
            ? body.messageId
            : '';

      // Create a properly typed response object
      let response: RetinaValidationResponse;

      // Handle different message formats that might come from the queue
      if ('status' in body) {
        // Standard format where status is directly in the body
        response = {
          status: body.status || 'success',
          matchingEmployeeId: body.matchingEmployeeId || null,
          similarity: typeof body.similarity === 'number' ? body.similarity : 0,
        };
      } else if (
        typeof body === 'object' &&
        'response' in body &&
        typeof body.response === 'object'
      ) {
        // Handle nested response format
        this.logger.log(
          `Found nested response format: ${JSON.stringify(body)}`,
        );
        const nestedResponse = body.response || {};

        response = {
          status:
            typeof nestedResponse.status === 'string'
              ? nestedResponse.status
              : 'success',
          matchingEmployeeId:
            typeof nestedResponse.matchingEmployeeId === 'string'
              ? nestedResponse.matchingEmployeeId
              : null,
          similarity:
            typeof nestedResponse.similarity === 'number'
              ? nestedResponse.similarity
              : 0,
        };
      } else {
        // Try to extract data from the message if it doesn't match expected formats
        this.logger.warn(
          `Unexpected message format, attempting to extract data: ${JSON.stringify(
            body,
          )}`,
        );

        // Create a response with available data
        response = {
          status: 'success',
          matchingEmployeeId: null,
          similarity: 0,
        };

        // Try to extract data from various possible formats
        if (typeof body === 'object') {
          if ('status' in body && typeof body.status === 'string') {
            response.status = body.status;
          }

          if ('matchingEmployeeId' in body) {
            response.matchingEmployeeId =
              typeof body.matchingEmployeeId === 'string'
                ? body.matchingEmployeeId
                : null;
          }

          if ('similarity' in body && typeof body.similarity === 'number') {
            response.similarity = body.similarity;
          }
        }
      }

      // Add the message ID to the response for correlation
      if (messageId) {
        response.messageId = messageId;
      }

      // Log the full response object
      this.logger.log(`Event response content: ${JSON.stringify(response)}`);

      // Emit an event for all responses immediately
      this.logger.log('Emitting validation.response event');
      this.eventEmitter.emit('validation.response', response);

      this.logger.log('Processed validation response');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to process validation response message: ${errorMessage}`,
      );

      // Log the stack trace if available
      if (error instanceof Error && error.stack) {
        this.logger.error(`Stack trace: ${error.stack}`);
      }
    }
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
    this.logger.log(
      `Waiting for validation response for messageId: ${messageId}`,
    );

    // Ensure the receiver is started
    if (!this.isListening) {
      this.logger.log('Receiver not listening, starting receiver');
      await this.startReceiver();
    }

    // Wait for any response with a timeout
    return new Promise<RetinaValidationResponse | null>((resolve) => {
      const timeoutId = setTimeout(() => {
        // Remove the listener and resolve with null if timeout
        this.eventEmitter.removeListener(
          'validation.response',
          responseHandler,
        );
        this.logger.warn(
          `Timeout waiting for validation response for messageId: ${messageId}`,
        );
        resolve(null);
      }, timeoutMs);

      // Handler for the validation response event
      const responseHandler = (response: RetinaValidationResponse) => {
        // Check if this response is for our message ID
        if (response.messageId === messageId) {
          clearTimeout(timeoutId);
          this.eventEmitter.removeListener(
            'validation.response',
            responseHandler,
          );
          this.logger.log(
            `Received matching validation response for messageId: ${messageId}`,
          );
          resolve(response);
        } else {
          this.logger.log(
            `Received non-matching validation response, expected: ${messageId}, got: ${response.messageId || 'undefined'}`,
          );
        }
      };

      // Listen for the validation response event
      this.eventEmitter.on('validation.response', responseHandler);
      this.logger.log(`Event listener registered for validation responses`);
    });
  }

  /**
   * Close the service bus client connection
   */
  async close(): Promise<void> {
    try {
      this.isListening = false;

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
