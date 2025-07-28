import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { StorageareaService } from './storagearea.service';
import { JwtAuthGuard } from '../../../common/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateStorageAreaDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { ParamsDto } from './dto/param.dto';

@ApiTags('Storagearea')
@ApiBearerAuth('jwt')
@Controller('storagearea')
export class StorageareaController {
  constructor(private readonly services: StorageareaService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: ParamsDto) {
    return this.services.findAll(query);
  }

  @ApiTags('PDA Inbounds')
  @UseGuards(JwtAuthGuard)
  @Get(':barcode')
  findOne(@Param('barcode') barcode: string) {
    return this.services.findById(barcode);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateStorageAreaDto, @Req() req) {
    return this.services.create(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':barcode')
  update(
    @Param('barcode') barcode: string,
    @Body() dto: UpdateDto,
    @Req() req,
  ) {
    return this.services.update(barcode, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':barcode')
  remove(@Param('barcode') barcode: string, @Req() req) {
    return this.services.remove(barcode, req.user.id);
  }
}
