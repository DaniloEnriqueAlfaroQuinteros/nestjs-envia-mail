import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { LoggerService } from '../../logger/logger.service';
import { DownloadResponse, Storage } from '@google-cloud/storage';
import { BodyOrder } from 'src/models/body.model';

@Injectable()
export class TransactionFlowService {
  constructor(
    private httpService: HttpService,
    private readonly logger: LoggerService,
  ) {}

  async getDTE(message: any) {
    const url_dte = process.env.URL_DTE_GET;

    try {
      this.logger.info(`DTE-GET-ID: ${message}`);
      const response = await this.httpService.axiosRef.get(
        'http://127.0.0.1:3500/docto?correlativo=000200044',
      );
      this.logger.info(
        `DTE-GET RESP await response.status: ` + response.status,
      );
      this.logger.info(`DTE-GET RESP await response.data: ` + response.data);
      return response;
    } catch (e) {
      if (e.response.status === HttpStatus.BAD_REQUEST) {
        throw new BadRequestException({
          status: 400,
          message: `{ FINISH - BAD REQUEST - STATUS: ${
            e.response.status
          } - ${JSON.stringify(e.response.data.message)}`,
        });
      } else if (e.response.status === HttpStatus.INTERNAL_SERVER_ERROR) {
        throw new InternalServerErrorException({
          status: 500,
          message: `{ FINISH - INTERNAL SERVER ERROR - STATUS: ${e.response.status} }`,
        });
      } else {
        throw new HttpException(
          `{ FINISH - ERROR - STATUS: ${e.response.status} - ${JSON.stringify(
            e.response,
          )}`,
          e.response.status,
        );
      }
    }
  }

  async postFTCCoreNotification(message: any) {
    const url_coreNotification = process.env.URL_CORE_NOTIFICATION_POST;

    try {
      this.logger.info(
        `POST CORE NOTIFICATION BODY ${JSON.stringify(message)}`,
      );
      const response = await this.httpService.axiosRef({
        method: 'POST',
        url: 'http://localhost:3500/docto',
        data: message,
      });
      this.logger.info(`POST CORE NOTIFICATION response: ` + { response });

      return response;
    } catch (e) {
      if (e.response.status === HttpStatus.BAD_REQUEST) {
        throw new BadRequestException({
          status: 400,
          message: `{ FINISH - BAD REQUEST - STATUS: ${
            e.response.status
          } - ${JSON.stringify(e.response.data.message)}`,
        });
      } else if (e.response.status === HttpStatus.INTERNAL_SERVER_ERROR) {
        throw new InternalServerErrorException({
          status: 500,
          message: `{ FINISH - INTERNAL SERVER ERROR - STATUS: ${e.response.status} }`,
        });
      } else {
        throw new HttpException(
          `{ FINISH - ERROR - STATUS: ${e.response.status} - ${JSON.stringify(
            e.response,
          )}`,
          e.response.status,
        );
      }
    }
  }

  async recvSendStorage(message: any) {
    //Document download
    const storage = new Storage({
      projectId: 'ornate-bebop-366420',
      apiEndpoint: 'https://storage.cloud.google.com',
    });
    storage.baseUrl =
      'https://storage.cloud.google.com/pdfdoc-bucket-1/Boleta.pdf?authuser=1';
    let contentsAux: string;
    let contentsAuxDestino: string;
    const bucketNameBegin = 'pdfdoc-bucket-1';
    const fileName = 'Boleta.pdf';
    const destFileName = 'Factura.pdf';
    let contents: any;
    async function downloadIntoMemory() {
      contents = await storage
        .bucket(bucketNameBegin)
        .file(fileName)
        .download();

      contentsAuxDestino = contents.toString();
      await storage.bucket(bucketNameBegin).file(destFileName).save(contents);
      this.logger.info(
        `Contents of gs://${bucketNameBegin}/${fileName} are ${contents.toString()}.`,
      );
    }
    downloadIntoMemory().catch(console.error);
    /*
    //Document upload
    const storageUpload = new Storage({"projectId": "ornate-bebop-366420", "apiEndpoint": "https://storage.cloud.google.com"});
    storageUpload.baseUrl = "https://storage.cloud.google.com/pdfdoc-bucket-destino/Boleta.pdf?authuser=1";
    const bucketNameEnd = "pdfdoc-bucket-destino";
    const destFileName= "Boleta.pdf";
   
    async function uploadFromMemory() {
      await storageUpload.bucket(bucketNameEnd).file(destFileName).save(contents);
      storageUpload.bucket(bucketNameEnd).file(destFileName).
      this.logger.info(
        `${destFileName} with contents ${contents} uploaded to ${bucketNameEnd}.`
      );
    }
    uploadFromMemory().catch(console.error);
    */
  }
}
