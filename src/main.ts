import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { PubSubServer } from './transports/pubSub/PubSubServer';
import { AllExceptionsFilter } from './exception-filters/all-exceptions.filter';
import { useContainer } from 'class-validator';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  const configService = app.get<ConfigService>(ConfigService);
  const loggerService = app.get<LoggerService>(LoggerService);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.connectMicroservice({
    strategy: new PubSubServer(),
  });
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalPipes(new ValidationPipe());
  
  app.useGlobalFilters(new AllExceptionsFilter(loggerService, configService));
  
  
  await app.startAllMicroservices();
                         
  if (configService.get<string>('environment') == 'development') {
    const options = new DocumentBuilder()
      .setTitle('Task API')
      .setDescription('PoC Microservicio invocando SQL Server')
      .setVersion('0.0.1')
      .addTag('tasks')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }


  await app.listen(configService.get<string>('port'));
  //this.logger.info(`Server Start Port ${configService.get<string>('port')}`);
}
bootstrap();
