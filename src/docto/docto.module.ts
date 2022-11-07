import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthModule } from '../auth/jwt-auth.módulo';
import { LoggerModule } from '../logger/logger.module';
import { DoctoController } from './docto.controller';
import { DoctoService } from './docto.service';
import { Docto } from './entities/docto.entity';

@Module({
  imports: [JwtAuthModule ,TypeOrmModule.forFeature([Docto]), LoggerModule],
  controllers: [DoctoController],
  providers: [DoctoService],
})
export class DoctoModule {}
