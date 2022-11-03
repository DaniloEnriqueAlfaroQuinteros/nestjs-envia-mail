import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { LoggerService } from './logger/logger.service';
import { TransactionFlowService } from './services/transactionFlow/transactionFlow.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { Repository } from 'typeorm';
import { Docto } from './docto/entities/docto.entity';
import { DoctoModule } from './docto/docto.module';
import { Storage } from '@google-cloud/storage';
import { DoctoService } from './docto/docto.service';
import { LoggerModule } from 'src/logger/logger.module';
import { DoctoController } from './docto//docto.controller';
import { HealthController } from './health/health.controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [
    Storage,
    LoggerModule,
    TerminusModule,
    HttpModule,
    TypeOrmModule.forFeature([Docto]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.mssql.host'),
        port: configService.get<number>('database.mssql.port'),
        username: configService.get<string>('database.mssql.username'),
        password: configService.get<string>('database.mssql.password'),
        database: configService.get<string>('database.mssql.database'),
        entities: [Docto],
        keepConnectionAlive: true,
        synchronize: false, //true crea la tabla
        autoLoadEntities: true,
        options: { encrypt: true },
        logging: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [AppController, DoctoController, HealthController],
  providers: [
    LoggerService,
    { provide: 'logName', useValue: '' },
    TransactionFlowService,
    DoctoService,
  ],
})
export class AppModule {}
