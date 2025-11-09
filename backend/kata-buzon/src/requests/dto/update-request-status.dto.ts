import { IsIn, IsOptional, IsString } from 'class-validator';
import { RequestStatus } from '../entities/request.entity';

export class UpdateRequestStatusDto {
  @IsIn(Object.values(RequestStatus))
  status: string;

  @IsOptional()
  @IsString()
  comments?: string;
}