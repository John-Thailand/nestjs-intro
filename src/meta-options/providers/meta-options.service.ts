import { Injectable } from '@nestjs/common';
import { CreateMetaOptionsDto } from '../dtos/create-post-meta-options.dto';
import { MetaOption } from '../meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  public async create(createPostMetaOptionsDto: CreateMetaOptionsDto) {
    const metaOption = this.metaOptionsRepository.create(
      createPostMetaOptionsDto,
    );
    return await this.metaOptionsRepository.save(metaOption);
  }
}
