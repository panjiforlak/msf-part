import { PartialType } from '@nestjs/mapped-types';
import { CreateWODto } from './create.dto';

export class UpdateDto extends PartialType(CreateWODto) {}
