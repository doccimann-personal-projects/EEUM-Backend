import { PartialType } from '@nestjs/swagger';
import { CreateDiaryDto } from './create-diary.request';

export class UpdateDiaryDto extends PartialType(CreateDiaryDto) {}
