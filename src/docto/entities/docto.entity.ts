import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Docto {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  correlativo: string;

  @ApiProperty()
  @Column()
  tipodoc: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  sucursal?: string;

  @ApiProperty()
  @Column()
  mail: string;

  @ApiProperty()
  @Column()
  link: string;

  @ApiProperty()
  @Column()
  fecha: string;
}
