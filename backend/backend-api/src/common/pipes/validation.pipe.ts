import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

/**
 * Global validation pipe for validating incoming data
 */
@Injectable()
export class ValidationPipe implements PipeTransform {
  /**
   * Transforms and validates incoming data
   * @param value - The value to transform and validate
   * @param metadata - Metadata about the value
   * @returns The transformed and validated value
   */
  async transform(value: unknown, metadata: ArgumentMetadata): Promise<unknown> {
    const { metatype } = metadata;
    
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    
    if (errors.length > 0) {
      const messages = errors.map(
        (error) => {
          const constraints = error.constraints ?? {};
          return Object.values(constraints).join(', ');
        },
      );
      
      throw new BadRequestException({
        message: 'Validation failed',
        errors: messages,
      });
    }
    
    return object;
  }

  /**
   * Checks if the metatype should be validated
   * @param metatype - The metatype to check
   * @returns Whether the metatype should be validated
   */
  private toValidate(metatype: Type<unknown>): boolean {
    const types: Type<unknown>[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
