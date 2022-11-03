import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctoDTO } from './dto/docto.dto';
import { Docto } from './entities/docto.entity';

@Injectable()
export class DoctoService {
  constructor(
    @InjectRepository(Docto)
    private readonly doctosRepository: Repository<Docto>,
  ) {}

  async create(docto: DoctoDTO): Promise<Docto> {
    return this.doctosRepository.save(docto);
  }

  async findOne(correlativo: string): Promise<Docto> {
    const docto: Docto = await this.doctosRepository.findOne({
      where: { correlativo: correlativo },
    });
    if (!docto) {
      throw new NotFoundException();
    } else {
      return docto;
    }
  }

  findAll(): Promise<Docto[]> {
    return this.doctosRepository.find();
  }

  async update(correlativo: string, docto: DoctoDTO): Promise<Docto> {
    const doctoExist = await this.findOne(correlativo);

    const updatedDocto: Docto = Object.assign(doctoExist, docto);
    return this.doctosRepository.save(updatedDocto);
  }

  async delete(correlativo: string): Promise<void> {
    await this.doctosRepository.delete(correlativo);
  }
}
