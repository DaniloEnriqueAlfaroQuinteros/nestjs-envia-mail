import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DoctoDTO, CoreNotification } from './dto/docto.dto';
import { Docto } from './entities/docto.entity';
import { DoctoService } from './docto.service';
import { LoggerService } from '../logger/logger.service';

@Controller('docto')
@ApiTags('docto')
export class DoctoController {
  transactionFlowService: any;
  constructor(
    private doctoService: DoctoService,
    private readonly logger: LoggerService,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'The docto is created',
    type: Docto,
  })
  @ApiResponse({
    status: 400,
    description: 'The body of docto is not a DoctoDto object',
  })
  @Post()
  create(@Body() doctoDTO: DoctoDTO): Promise<Docto> {
    this.logger.info('doctoDTO.correlativo: ' + doctoDTO.correlativo);
    this.logger.info('doctoDTO.mail: ' + doctoDTO.mail);
    this.logger.info('doctoDTO.link: ' + doctoDTO.link);
    let coreNotification = new CoreNotification();
    coreNotification.correlativo = doctoDTO.correlativo;
    coreNotification.mail = doctoDTO.mail;
    coreNotification.link = doctoDTO.link;
    let responseFTC = this.transactionFlowService.postFTCCoreNotification(coreNotification);
    this.logger.info('responseFTC.status: ' + responseFTC.status);
    return responseFTC;
    
  }

  @UseGuards(JwtAuthGuard)
  @Get(':correlativo')
  @ApiResponse({ status: 200, description: 'Gets one docto', type: Docto })
  @ApiResponse({ status: 404, description: 'Docto not found' })
  findOne(@Param('correlativo') correlativo: string): Promise<Docto> {
    this.logger.info('Getting task ' + correlativo);
    return this.doctoService.findOne(correlativo);
  }

  @ApiResponse({
    status: 200,
    description: 'Gets all doctos',
    type: Docto,
    isArray: true,
  })
  @Get()
  findAll(): Promise<Docto[]> {
    return this.doctoService.findAll();
  }

  @Put(':correlativo')
  @ApiResponse({
    status: 200,
    description: 'The docto is updated',
    type: Docto,
  })
  @ApiResponse({
    status: 400,
    description: 'The body of docto is not a DoctoDto object',
  })
  update(
    @Param('correlativo') correlativo: string,
    @Body() doctoDTO: DoctoDTO,
  ): Promise<Docto> {
    return this.doctoService.update(correlativo, doctoDTO);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'The docto is deleted' })
  delete(@Param('id') id: string): void {
    this.doctoService.delete(id);
  }
}
