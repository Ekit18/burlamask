import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class SearchImageDTO {
  @ApiProperty({ example: '1', description: 'Description of the image being created' })
  @IsString({ message: '$property must be string' })
  readonly query: string;
}
