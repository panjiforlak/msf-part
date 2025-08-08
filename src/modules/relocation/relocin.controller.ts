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
import { RelocInboundService } from './relocin.service';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateRelocInDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { ParamsDto } from './dto/param.dto';
import { IsArray, ValidateNested } from 'class-validator';

@ApiTags('RelocInbound')
@ApiBearerAuth('jwt')
@Controller('reloc-inbound')
export class RelocInboundController {
  constructor(private readonly services: RelocInboundService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: ParamsDto) {
    return this.services.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/history')
  findAllRelocInbound(@Query() query: ParamsDto) {
    return this.services.findAllRelocationInbound(query);
  }

  @Get('pda/:pickerId')
  findAllPDA(@Param('pickerId') pickerId: number, @Query() query: ParamsDto) {
    return this.services.findAllPDA(pickerId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.services.findById(slug);
  }

  @UseGuards(JwtAuthGuard)
  @IsArray()
  @ValidateNested({ each: true })
  @Post()
  create(@Body() dto: CreateRelocInDto, @Req() req) {
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
