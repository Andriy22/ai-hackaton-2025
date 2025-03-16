import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO for retrieving an image from blob storage
 */
export class GetImageDto {
  @ApiProperty({
    description: 'Name of the image to retrieve',
    example: 'patient123-retina-scan.jpg',
  })
  @IsNotEmpty()
  @IsString()
  imageName: string;
}
