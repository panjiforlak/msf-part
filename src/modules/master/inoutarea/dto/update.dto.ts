import { PartialType } from '@nestjs/mapped-types';
import { CreateInOutAreaDto } from './create.dto';

export class UpdateDto extends PartialType(CreateInOutAreaDto) {}
