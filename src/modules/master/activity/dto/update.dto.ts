import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityDto } from './create.dto';

export class UpdateDto extends PartialType(CreateActivityDto) {}
