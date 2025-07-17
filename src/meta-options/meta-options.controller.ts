import { Body, Controller, Post } from '@nestjs/common';
import { CreateMetaOptionsDto } from './dtos/create-post-meta-options.dto';
import { MetaOptionsService } from './providers/meta-options.service';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(private readonly metaOptionsService: MetaOptionsService) {}

  @Post()
  public create(@Body() createMetaOptionsDto: CreateMetaOptionsDto) {
    return this.metaOptionsService.create(createMetaOptionsDto);
  }
}
