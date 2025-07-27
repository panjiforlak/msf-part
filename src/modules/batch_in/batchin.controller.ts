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
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BatchInboundService } from './batchin.service';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateBatchInDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { ParamsDto } from './dto/param.dto';
import { IsArray, ValidateNested } from 'class-validator';

@ApiTags('BatchInbound')
@ApiBearerAuth('jwt')
@Controller('batch-inbound')
export class BatchInboundController {
  constructor(private readonly services: BatchInboundService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: ParamsDto) {
    return this.services.findAll(query);
  }

  @ApiTags('PDA')
  @UseGuards(JwtAuthGuard)
  @Get('pda/:pickerId')
  findAllPDA(@Param('pickerId') pickerId: number, @Query() query: ParamsDto) {
    return this.services.findAllPDA(pickerId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.services.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @IsArray()
  @ValidateNested({ each: true })
  @Post()
  create(@Body() dto: CreateBatchInDto[], @Req() req) {
    return this.services.createMany(dto, req.user.id);
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
