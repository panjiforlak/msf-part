import { PartialType } from '@nestjs/mapped-types';
import { CreateBatchInDto } from './create.dto';

export class UpdateDto extends PartialType(CreateBatchInDto) {}
