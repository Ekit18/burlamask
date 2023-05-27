import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateImageDTO {
  @ApiProperty({ example: '1', description: 'Description of the image being created' })
  @IsNumber({}, { message: '$property must be string' })
  readonly description: string;
}
