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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateBatchInDto,
  CreatePDABatchInDto,
  PostPDAQueueDto,
  CreatePDAStorageB2RDto,
} from './dto/create.dto';
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

  // StartPDA Inbound
  @ApiTags('PDA Inbounds')
  @ApiOperation({
    summary:
      'List PDA inbound. tambahkan query param saat scan barcode search={barcodenya}',
  })
  @UseGuards(JwtAuthGuard)
  @Get('pda/:pickerId')
  findAllPDA(@Param('pickerId') pickerId: number, @Query() query: ParamsDto) {
    return this.services.findAllPDA(pickerId, query);
  }

  @ApiTags('PDA Inbounds') // post queue
  @ApiOperation({ summary: 'POST untuk masuk antrian barang' })
  @UseGuards(JwtAuthGuard)
  @Post('pda/queue')
  postingPDAQueue(@Body() dto: PostPDAQueueDto, @Req() req) {
    return this.services.queuePDA(dto, req.user.id);
  }

  @ApiTags('PDA Inbounds') // get queue
  @ApiOperation({
    summary: 'List Antrian barang by picker after scan barang yang mau dibawa',
  })
  @UseGuards(JwtAuthGuard)
  @Get('pda/queue/:pickerId')
  findAllPDAQueue(
    @Param('pickerId') pickerId: number,
    @Query() query: ParamsDto,
  ) {
    return this.services.findAllPDAQueue(pickerId, query);
  }

  @ApiTags('PDA Inbounds')
  @ApiOperation({ summary: 'Saat Save untuk relocation item to RACKS or BOX' })
  @UseGuards(JwtAuthGuard)
  @Post('pda')
  createPDAInbound(@Body() dto: CreatePDABatchInDto, @Req() req) {
    return this.services.createPDA(dto, req.user.id);
  }
  // END PDA Inbound

  @UseGuards(JwtAuthGuard)
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.services.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @IsArray()
  @ApiBody({
    type: CreateBatchInDto,
    isArray: true,
  })
  @ApiOperation({ summary: 'Create Batch Inbound' })
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

  // get list inventory B2R
  @ApiTags('PDA Storage')
  @ApiOperation({
    summary: 'ITEM LIST BOX TO RACK (B2R)',
  })
  @UseGuards(JwtAuthGuard)
  @Get('pda/b2r/:pickerId')
  findAllPDAB2r(
    @Param('pickerId') pickerId: number,
    @Query() query: ParamsDto,
  ) {
    return this.services.findAllPDAB2r(pickerId, query);
  }

  // Post rack inventory B2R
  @ApiTags('PDA Storage')
  @ApiOperation({ summary: 'POSTING BOX to RACKS (B2R)' })
  @UseGuards(JwtAuthGuard)
  @Post('pda/b2r')
  createPDAb2r(@Body() dto: CreatePDAStorageB2RDto, @Req() req) {
    return this.services.createPDAb2r(dto, req.user.id);
  }

  // get list inventory R2R
  @ApiTags('PDA Storage')
  @ApiOperation({
    summary: 'ITEM LIST RACK TO RACK (R2R)',
  })
  @UseGuards(JwtAuthGuard)
  @Get('pda/r2r/:pickerId')
  findAllPDAR2r(
    @Param('pickerId') pickerId: number,
    @Query() query: ParamsDto,
  ) {
    return this.services.findAllPDAR2r(pickerId, query);
  }

  // Post rack inventory B2R
  @ApiTags('PDA Storage')
  @ApiOperation({ summary: 'POSTING RACKS to RACKS (R2R)' })
  @UseGuards(JwtAuthGuard)
  @Post('pda/b2r')
  createPDAR2r(@Body() dto: CreatePDAStorageB2RDto, @Req() req) {
    return this.services.createPDAR2r(dto, req.user.id);
  }
}
