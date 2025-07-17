import { IsJSON, IsNotEmpty } from 'class-validator';

export class CreateMetaOptionsDto {
  @IsNotEmpty()
  @IsJSON()
  metaValue: string;
}
