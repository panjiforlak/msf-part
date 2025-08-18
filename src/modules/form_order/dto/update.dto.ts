import { PartialType } from '@nestjs/mapped-types';
import { CreateFormOrderDto } from './create.dto';

export class UpdateDto extends PartialType(CreateFormOrderDto) {}
