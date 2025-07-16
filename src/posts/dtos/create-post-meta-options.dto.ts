import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMetaOptionsDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  value: any;
}
