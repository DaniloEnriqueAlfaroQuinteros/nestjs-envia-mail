import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'src/logger/logger.module';
import { DoctoController } from './docto.controller';
import { DoctoService } from './docto.service';
import { Docto } from './entities/docto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Docto]), LoggerModule],
  controllers: [DoctoController],
  providers: [DoctoService],
})
export class DoctoModule {}
