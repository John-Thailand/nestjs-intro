import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import * as path from 'path';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class UploadToAwsProvider {
  constructor(private readonly configService: ConfigService) {}

  public async fileUpload(file: Express.Multer.File) {
    const s3 = new S3();

    try {
      const uploadResult = await s3
        .upload({
          Bucket: this.configService.get('appConfig.awsBucketName'),
          Body: file.buffer,
          Key: this.generateFileName(file),
          ContentType: file.mimetype,
        })
        .promise();
      return uploadResult.Key;
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }

  private generateFileName(file: Express.Multer.File) {
    // extract file name
    let name = file.originalname.split('.')[0];
    // remove white spaces
    // \sは空白文字（スペース、タブ、改行）
    // gはグローバルマッチ（全ての一致を対象）
    name.replace(/\s/g, '').trim();
    // extract the extension
    const extension = path.extname(file.originalname);
    // generate time stamp
    const timestamp = new Date().getTime().toString().trim();
    // return file uuid
    return `${name}-${timestamp}-${uuid4()}${extension}`;
  }
}
