import { ServiceBusClient, ServiceBusMessage } from '@azure/service-bus';
import { Injectable, Logger } from '@nestjs/common';

/**
 * Interface for retina image command
 */
export interface RetinaImageCommand {
  image_path: string;
  employeeId: string;
  imgId: string;
}

/**
 * Interface for retina validation command
 */
export interface RetinaValidationCommand {
  image_path: string;
  employees: Array<{
    employeeId: string;
    documentId: string;
  }>;
  messageId: string;
  originatingInstance?: string;
}

/**
 * Service for interacting with Azure Service Bus
 */
@Injectable()
export class ServiceBusService {
  private readonly logger = new Logger(ServiceBusService.name);
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  private readonly serviceBusClient: ServiceBusClient | null = null;
  private readonly queueName: string;
  private readonly validationQueueName: string;
  private readonly instanceId: string;
  private readonly port: string;

  constructor() {
    // Generate a unique instance ID that includes the port number for traceability
    this.port = process.env.PORT || '3000';
    this.instanceId = `service-bus-instance-port-${this.port}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    this.logger.log(
      `Service Bus Service instance ID: ${this.instanceId} on port ${this.port}`,
    );

    try {
      const connectionString = process.env.AZURE_SERVICE_BUS_CONNECTION_STRING;
      this.queueName =
        process.env.AZURE_SERVICE_BUS_QUEUE_NAME || 'retina-processing';
      this.validationQueueName =
        process.env.AZURE_SERVICE_BUS_VALIDATION_QUEUE_NAME ||
        'retina-validation-queue';

      if (connectionString) {
        this.serviceBusClient = new ServiceBusClient(connectionString);
        this.logger.log('ServiceBusService initialized successfully');
      } else {
        this.logger.warn(
          'Azure Service Bus connection string is not defined. Service Bus functionality will be disabled.',
        );
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to initialize ServiceBusService: ${errorMessage}`,
      );
    }
  }

  /**
   * Send a retina image command to the service bus
   * @param command - Retina image command to send
   * @returns Boolean indicating whether the message was sent successfully
   */
  async sendRetinaImageCommand(command: RetinaImageCommand): Promise<boolean> {
    if (!this.serviceBusClient) {
      this.logger.warn(
        'Service Bus client is not initialized. Message not sent.',
      );
      return false;
    }

    try {
      const sender = this.serviceBusClient.createSender(this.queueName);

      const message: ServiceBusMessage = {
        body: command,
        contentType: 'application/json',
      };

      await sender.sendMessages(message);
      await sender.close();

      this.logger.log(
        `Retina image command sent successfully for employee ${command.employeeId}, image ${command.imgId}`,
      );
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to send retina image command: ${errorMessage}`);
      return false;
    }
  }

  /**
   * Send a retina validation command to the service bus
   * @param command - Retina validation command to send
   * @returns True if the command was sent successfully, false otherwise
   */
  async sendRetinaValidationCommand(
    command: RetinaValidationCommand,
  ): Promise<boolean> {
    if (!this.serviceBusClient) {
      this.logger.warn(
        'Service Bus client is not initialized. Message not sent.',
      );
      return false;
    }

    try {
      // Add the originating instance ID to track which instance sent the command
      command.originatingInstance = this.instanceId;

      const sender = this.serviceBusClient.createSender(
        this.validationQueueName,
      );

      const message: ServiceBusMessage = {
        body: command,
        contentType: 'application/json',
        messageId: command.messageId,
        // Add a reply-to property to indicate which queue to send the response to
        replyTo:
          process.env.AZURE_SERVICE_BUS_VALIDATION_RESPONSE_QUEUE_NAME ||
          'retina-validation-response-queue',
        // Add application properties to help with message routing
        applicationProperties: {
          originatingPort: this.port,
          originatingInstance: this.instanceId,
        },
      };

      await sender.sendMessages(message);
      await sender.close();

      this.logger.log(
        `Retina validation command sent successfully for image ${command.image_path} with messageId ${command.messageId}`,
      );
      this.logger.log(
        `Response expected on queue: ${message.replyTo} for instance ${this.instanceId} on port ${this.port}`,
      );
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to send retina validation command: ${errorMessage}`,
      );
      return false;
    }
  }

  /**
   * Close the service bus client connection
   */
  async close(): Promise<void> {
    if (this.serviceBusClient) {
      try {
        await this.serviceBusClient.close();
        this.logger.log('Service Bus client closed successfully');
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(
          `Failed to close Service Bus client: ${errorMessage}`,
        );
      }
    }
  }
}
