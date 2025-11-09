import { IsNotEmpty, IsString, IsUUID, IsIn } from 'class-validator';
import { RequestType } from '../entities/request.entity';

export class CreateRequestDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsIn(Object.values(RequestType))
  type: string;

  @IsNotEmpty()
  @IsUUID()
  assignedToId: string;
}