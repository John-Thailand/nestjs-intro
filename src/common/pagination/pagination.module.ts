import { Module } from '@nestjs/common';
import { PaginationProvider } from './providers/pagination/pagination.provider';

@Module({
  providers: [PaginationProvider],
  exports: [PaginationProvider],
})
export class PaginationModule {}
