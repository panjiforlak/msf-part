import { PartialType } from '@nestjs/mapped-types';
import { CreateRelocInDto } from './create.dto';

export class UpdateDto extends PartialType(CreateRelocInDto) {}
