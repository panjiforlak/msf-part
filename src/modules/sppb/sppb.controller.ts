import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SppbService } from './sppb.service';
import { SppbListResponseDto } from './dto/response.dto';
import { SppbListQueryDto } from './dto/query.dto';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { ApiResponse as ApiResponseType } from '../../common/helpers/response.helper';

@ApiTags('SPPB')
@ApiBearerAuth('jwt')
@Controller('sppb')
export class SppbController {
  constructor(private readonly sppbService: SppbService) {}

  @UseGuards(JwtAuthGuard)
  @Get('list')
  @ApiOperation({ summary: 'Get SPPB list with filters and pagination' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', example: 10 })
  @ApiQuery({ name: 'month', required: false, description: 'Filter by month (1-12)', example: 1 })
  @ApiQuery({ name: 'keyword', required: false, description: 'Search keyword in sppb_number, department_name, author, picker', example: 'WHO001' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved SPPB list',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Get SPPB list successfully' },
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/SppbListResponseDto' },
        },
        pagination: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 1 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            lastPage: { type: 'number', example: 1 },
          },
        },
      },
    },
  })
  async getSppbList(
    @Query() query: SppbListQueryDto,
  ): Promise<ApiResponseType<SppbListResponseDto[]>> {
    return this.sppbService.getSppbList(query);
  }


} 