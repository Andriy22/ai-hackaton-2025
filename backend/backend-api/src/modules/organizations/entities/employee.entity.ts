import { ApiProperty } from '@nestjs/swagger';

export class EmployeeEntity {
  @ApiProperty({ description: 'Unique identifier of the employee' })
  id: string;

  @ApiProperty({ description: 'First name of the employee' })
  firstName: string;

  @ApiProperty({ description: 'Last name of the employee' })
  lastName: string;

  @ApiProperty({ description: 'Birth date of the employee' })
  birthDate: Date;

  @ApiProperty({ description: 'Position of the employee in the organization' })
  position: string;

  @ApiProperty({
    description: 'ID of the organization the employee belongs to',
  })
  organizationId: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
