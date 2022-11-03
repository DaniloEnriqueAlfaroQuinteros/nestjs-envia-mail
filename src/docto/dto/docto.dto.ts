import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class DoctoDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  correlativo: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tipodoc: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sucursal?: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  mail: string;
  @ApiProperty()
  @IsString()
  pdf: string;
  @ApiProperty()
  @IsString()
  link: string;
  @ApiProperty()
  @IsString()
  fecha: string;
}
export class MensajePubSub {
  correlativo: string;
  tipodoc: string;
  sucursal: string;
  mail: string;
  fecha: string;
}
export class CoreNotification {
  correlativo: string;
  tipodoc: string;
  sucursal: string;
  mail: string;
  pdf: string;
  link: string;
  fecha: string;
}

export class DocumentoDTE {
  correlativo: string;
  tipodoc: string;
  sucursal: string;
  mail: string;
  pdf: string;
  link: string;
}

export class StorageDTE {
  correlativo: string;
  tipodoc: string;
  sucursal: string;
  mail: string;
  pdf: string;
  link: string;
}
