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
import { InOutAreaService } from './inout.service';
import { JwtAuthGuard } from '../../../common/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateInOutAreaDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { ParamsDto } from './dto/param.dto';

@ApiTags('InboundOutboundArea')
@ApiBearerAuth('jwt')
@Controller('in-out-area')
export class InOutAreaController {
  constructor(private readonly services: InOutAreaService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: ParamsDto) {
    return this.services.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.services.findById(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateInOutAreaDto, @Req() req) {
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
