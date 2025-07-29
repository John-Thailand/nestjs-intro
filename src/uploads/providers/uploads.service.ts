import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
  public async uploadFile(file: Express.Multer.File) {
    // Upload to the file to AWS S3
    // Generate to a new entry in database
  }
}
