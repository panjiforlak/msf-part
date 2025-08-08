import { PartialType } from '@nestjs/mapped-types';
import { CreateStorageAreaDto } from './create.dto';

export class UpdateDto extends PartialType(CreateStorageAreaDto) {}
