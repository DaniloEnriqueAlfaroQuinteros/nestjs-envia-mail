import { Controller, Get, Req, Res, Post, HttpStatus } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { Message } from '@google-cloud/pubsub';
import { TransactionFlowService } from './services/transactionFlow/transactionFlow.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DoctoDTO,
  CoreNotification,
  DocumentoDTE,
  StorageDTE,
  MensajePubSub,
} from './docto/dto/docto.dto';
import { Docto } from './docto/entities/docto.entity';

import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DoctoService } from './docto/docto.service';
import { LoggerService } from './logger/logger.service';

@Controller()
export class AppController {
  constructor(
    private readonly transactionFlowService: TransactionFlowService,
    private doctoService: DoctoService,
    private readonly logger: LoggerService,
  ) {}

  /*
  // Healthy
  @Get('/healthy')
  async healthy(@Req() req: any, @Res() res: any) {
    return res.status(HttpStatus.OK).json({ success: true });
  }
  */
  // PubSub Listener
  @EventPattern('projects/ornate-bebop-366420/subscriptions/doc') //conexion con el topico para traer la data
  async messageHandler(message: Message) {
    try {
      //Data que llega desde Hermes
      const mensaje = message ? message.toString() : null;
      this.logger.info(`START Handler.`);
      this.logger.info(`En masseHandler --> mensaje: ${mensaje})}`);
      this.logger.info(
        `En masseHandler --> mensaje JSON.stringify: ${JSON.stringify(
          mensaje,
        )}`,
      );

      const obj2 = JSON.parse(mensaje);
      this.logger.info(obj2.tipodoc);

      //Graba en Tabla
      const doctoDTO = new DoctoDTO();
      //Datos para prueba inicial.
      doctoDTO.correlativo = '003344001288';
      doctoDTO.sucursal = '00521';
      doctoDTO.tipodoc = 'FME';
      doctoDTO.mail = 'danilo.alfaro.q@xintec.cl';
      //doctoDTO.fecha= "20221025";

      this.logger.info(`Antes de Parser`);
      const jsonMensajePubSub = JSON.parse(mensaje);
      this.logger.info(`Despues de Parsear:` + jsonMensajePubSub.mail);
      doctoDTO.correlativo = jsonMensajePubSub.correlativo;
      doctoDTO.mail = jsonMensajePubSub.mail;
      doctoDTO.tipodoc = jsonMensajePubSub.tipodoc;
      doctoDTO.sucursal = '00521';
      const dat = new Date(); //Obtienes la fecha
      doctoDTO.fecha = dat.toString();

      const coreNotification = new CoreNotification();
      coreNotification.tipodoc = doctoDTO.tipodoc;
      coreNotification.correlativo = doctoDTO.correlativo;
      coreNotification.sucursal = doctoDTO.sucursal;
      coreNotification.mail = doctoDTO.mail;
      coreNotification.link = '/storege/MailDoc/10222.pdf';
      coreNotification.pdf = '10222.pdf';

      const idCorrelativo = doctoDTO.correlativo;

      const storageDTE = new StorageDTE();
      storageDTE.tipodoc = doctoDTO.tipodoc;
      storageDTE.correlativo = doctoDTO.correlativo;
      storageDTE.sucursal = doctoDTO.sucursal;
      storageDTE.mail = doctoDTO.mail;
      storageDTE.link = '/storage/MailDoc/10222.pdf';
      storageDTE.pdf = '10222.pdf';
      //let responseStorage = await this.transactionFlowService.recvSendStorage(storageDTE);
      //this.logger.info(`Response Storage: `+responseStorage);
      const retorno = 1;
      if (retorno == 1) {
        const responseDTE = await this.transactionFlowService.getDTE(
          idCorrelativo,
        );
        this.logger.info(
          `Response getDTE responseDTE.status: ` + responseDTE.status,
        );
        this.logger.info(
          `Response getDTE responseDTE.data.correlativo: ` +
            responseDTE.data.correlativo,
        );
        this.logger.info(
          `Response getDTE responseDTE.data.pdf: ` + responseDTE.data.pdf,
        );
        this.logger.info(
          `Response getDTE responseDTE.data.link: ` + responseDTE.data.link,
        );
        if (responseDTE.status == HttpStatus.OK) {
          this.logger.info(`DTE-Correcto`);
          
          const responseStorage =
            await this.transactionFlowService.recvSendStorage(responseDTE);
          this.logger.info(`Response Storage: ` + responseStorage);
          
          coreNotification.link = responseDTE.data.link;
          const responseFTC =
            await this.transactionFlowService.postFTCCoreNotification(
              coreNotification,
            );
          this.logger.info(
            `Response postFTCCoreNotification responseFTC.status: ` +
              responseFTC.status,
          );
          if (responseFTC.status == HttpStatus.CREATED) {
            //Graba en Tabla
            doctoDTO.link = responseDTE.data.link;
            this.logger.info(`Antes de crear registro`);
            this.doctoService.create(doctoDTO);
            this.logger.info(`Despues de crear registro`);

            message.ack();
          }
        }
      }
    } catch (e) {
      //this.loggerService.error(`ERROR: ${e.message}`);
      this.logger.error(`ERROR en messageHandler de Controller`, e);
    }
  }
}
