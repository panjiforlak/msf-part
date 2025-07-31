import { Controller, Get, Query, UseGuards, Request, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { PdaOutboundService } from './pda_outbound.service';
import { PdaOutboundQueryDto } from './dto/query.dto';
import { PdaOutboundResponseDto } from './dto/response.dto';
import { BatchOutboundResponseDto } from './dto/batch-outbound-response.dto';
import { successResponse } from '../../common/helpers/response.helper';

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
    description: 'Mengambil data batch outbound berdasarkan order form ID'
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
    @Param('orderFormId', ParseIntPipe) orderFormId: number
  ) {
    const data = await this.pdaOutboundService.findBatchOutboundByOrderFormId(orderFormId);
    return successResponse(data, 'Data Batch Outbound berhasil diambil');
  }
} 