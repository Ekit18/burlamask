import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class DeleteImageDTO {
  @ApiProperty({ example: '1', description: 'Id of the image to get' })
  @IsNumber({}, { message: '$property must be number' })
  readonly imageId: number;
}
