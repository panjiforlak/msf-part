import { Controller, Get, Post, Query, UseGuards, Request, Param, ParseIntPipe, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { PdaOutboundService } from './pda_outbound.service';
import { PdaOutboundQueryDto } from './dto/query.dto';
import { PdaOutboundResponseDto } from './dto/response.dto';
import { BatchOutboundResponseDto } from './dto/batch-outbound-response.dto';
import { CreateRelocationDto } from './dto/create-relocation.dto';
import { ScanDestinationDto } from './dto/scan-destination.dto';
import { ScanDestinationResponseDto } from './dto/scan-destination-response.dto';
import { GetAreaOutboundDto, GetAreaOutboundResponseDto } from './dto/get-area-outbound.dto';
import { successResponse } from '../../common/helpers/response.helper';
import { RelocationHistoryResponseDto, RelocationHistoryQueryDto } from './dto/relocation-history.dto';

@ApiTags('PDA Outbound')
@Controller('pda-outbound')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class PdaOutboundController {
  constructor(private readonly pdaOutboundService: PdaOutboundService) {}

  @Get()
  @ApiOperation({
    summary: 'Get PDA Outbound Data',
    description: 'Mengambil data order form berdasarkan picker_id dari token JWT atau semua data jika superadmin'
  })
  @ApiResponse({
    status: 200,
    description: 'Data berhasil diambil',
    type: [PdaOutboundResponseDto]
  })
  async findAll(
    @Request() req,
    @Query() query: PdaOutboundQueryDto
  ) {
    const userId = req.user.id;
    const data = await this.pdaOutboundService.findAll(userId, query.superadmin);
    return successResponse(data, 'Data PDA Outbound berhasil diambil');
  }

  @Get(':orderFormId/batch-outbound')
  @ApiOperation({
    summary: 'Get Batch Outbound Data by Order Form ID',
    description: 'Mengambil data batch outbound berdasarkan order form ID. Jika parameter is_queue=true, hanya menampilkan data yang sudah masuk ke tabel relocation (flag_queue=true)'
  })
  @ApiParam({
    name: 'orderFormId',
    description: 'ID dari order form',
    type: 'number',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Data batch outbound berhasil diambil',
    type: [BatchOutboundResponseDto]
  })
  async findBatchOutboundByOrderFormId(
    @Param('orderFormId', ParseIntPipe) orderFormId: number,
    @Query('is_queue') isQueue?: string
  ) {
    const isQueueBoolean = isQueue === 'true';
    const data = await this.pdaOutboundService.findBatchOutboundByOrderFormId(orderFormId, isQueueBoolean);
    return successResponse(data, 'Data Batch Outbound berhasil diambil');
  }

  @Post('relocation')
  @ApiOperation({
    summary: 'Create Relocation',
    description: 'Membuat data relocation berdasarkan barcode inbound'
  })
  @ApiResponse({
    status: 200,
    description: 'Relocation berhasil dibuat'
  })
  @ApiResponse({
    status: 404,
    description: 'Barcode inbound tidak ditemukan'
  })
  async createRelocation(
    @Request() req,
    @Body() createRelocationDto: CreateRelocationDto
  ) {
    const userId = req.user.id;
    const data = await this.pdaOutboundService.createRelocation(createRelocationDto, userId);
    return successResponse(data, 'Relocation berhasil dibuat', 200);
  }

  @Post('scan-destination')
  @ApiOperation({
    summary: 'Scan Destination',
    description: 'Scan destination untuk proses outbound dengan quantity yang bisa dicicil'
  })
  @ApiResponse({
    status: 201,
    description: 'Scan destination berhasil diproses',
    type: ScanDestinationResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Barcode inbound atau batch outbound tidak ditemukan'
  })
  async scanDestination(
    @Request() req,
    @Body() scanDestinationDto: ScanDestinationDto
  ) {
    const userId = req.user.id;
    const data = await this.pdaOutboundService.scanDestination(scanDestinationDto, userId);
    return successResponse(data, 'Scan destination berhasil diproses', 201);
  }

  @Get('get-area-outbound')
  @ApiOperation({
    summary: 'Get Area Outbound',
    description: 'Mengambil data area outbound berdasarkan barcode area'
  })
  @ApiResponse({
    status: 200,
    description: 'Data area outbound berhasil diambil',
    type: [GetAreaOutboundResponseDto]
  })
  @ApiResponse({
    status: 400,
    description: 'Barcode area tidak ditemukan di tabel inbound_outbound_area'
  })
  async getAreaOutbound(
    @Query() getAreaOutboundDto: GetAreaOutboundDto
  ) {
    const data = await this.pdaOutboundService.getAreaOutbound(getAreaOutboundDto);
    return successResponse(data, 'Data area outbound berhasil diambil');
  }

  @Get('relocation-history')
  @ApiOperation({
    summary: 'Get Relocation History',
    description: 'Mengambil data riwayat relocation dengan reloc_type = outbound'
  })
  @ApiResponse({
    status: 200,
    description: 'Data relocation history berhasil diambil',
    type: [RelocationHistoryResponseDto]
  })
  async getRelocationHistory(
    @Query() query: RelocationHistoryQueryDto
  ) {
    const data = await this.pdaOutboundService.getRelocationHistory(query);
    return successResponse(data, 'Data relocation history berhasil diambil');
  }
} 