import { PartialType } from '@nestjs/mapped-types';
import { CreateDocShipDto } from './create.dto';

export class UpdateDto extends PartialType(CreateDocShipDto) {}
