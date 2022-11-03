import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
class MessageDTO {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  incrementalOmnixId: string;
}
export class BodyDTO {
  @IsString()
  transactionId: string;

  @IsNumber()
  code: number;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MessageDTO)
  message: MessageDTO;
}
