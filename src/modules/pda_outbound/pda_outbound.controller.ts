import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { PdaOutboundService } from './pda_outbound.service';
import { PdaOutboundQueryDto } from './dto/query.dto';
import { PdaOutboundResponseDto } from './dto/response.dto';
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
} 