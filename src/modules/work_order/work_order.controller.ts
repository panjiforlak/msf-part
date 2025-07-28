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
  ParseIntPipe,
} from '@nestjs/common';
import { WorkOrderService } from './work_order.service';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse as SwaggerApiResponse } from '@nestjs/swagger';
import { CreateWorkOrderDto } from './dto/create.dto';
import { UpdateWorkOrderDto } from './dto/update.dto';
import { ParamsDto } from './dto/param.dto';

@ApiTags('Work Order')
@ApiBearerAuth('jwt')
@Controller('work-order')
export class WorkOrderController {
  constructor(private readonly workOrderService: WorkOrderService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ 
    summary: 'Get all work orders',
    description: 'Retrieve a paginated list of all work orders with optional search functionality'
  })
  @SwaggerApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved work orders list',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              uuid: { type: 'string' },
              vin_number: { type: 'string' },
              driver: { type: 'string' },
              mechanic: { type: 'string' },
              request: { type: 'string' },
              departement: { type: 'string' },
              remark: { type: 'string' },
              start_date: { type: 'string', format: 'date-time' },
              end_date: { type: 'string', format: 'date-time' },
              status: { type: 'string', enum: ['pending', 'in_progress', 'completed', 'cancelled'] }
            }
          }
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        message: { type: 'string' }
      }
    }
  })
  @SwaggerApiResponse({ status: 500, description: 'Internal server error' })
  findAll(@Query() query: ParamsDto) {
    return this.workOrderService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  @ApiOperation({ 
    summary: 'Test work order connection',
    description: 'Test if work order tables exist and are accessible'
  })
  testConnection() {
    return this.workOrderService.testConnection();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ 
    summary: 'Get work order by ID',
    description: 'Retrieve detailed information about a specific work order including sparepart list'
  })
  @SwaggerApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved work order details',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            uuid: { type: 'string' },
            vin_number: { type: 'string' },
            driver: { type: 'string' },
            mechanic: { type: 'string' },
            request: { type: 'string' },
            departement: { type: 'string' },
            remark: { type: 'string' },
            start_date: { type: 'string', format: 'date-time' },
            end_date: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['pending', 'in_progress', 'completed', 'cancelled'] },
            sparepart_list: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  part_name: { type: 'number' },
                  destination: { type: 'number' },
                  quantity: { type: 'number' }
                }
              }
            }
          }
        },
        message: { type: 'string' }
      }
    }
  })
  @SwaggerApiResponse({ status: 404, description: 'Work order not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.workOrderService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ 
    summary: 'Create new work order',
    description: 'Create a new work order with sparepart list. The system will automatically create batch_outbound and reloc_outbound records.'
  })
  @SwaggerApiResponse({ 
    status: 201, 
    description: 'Work order created successfully',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'null' },
        message: { type: 'string' }
      }
    }
  })
  @SwaggerApiResponse({ status: 400, description: 'Bad request - validation error' })
  create(@Body() createWorkOrderDto: CreateWorkOrderDto, @Req() req) {
    return this.workOrderService.create(createWorkOrderDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ 
    summary: 'Update work order by ID',
    description: 'Update an existing work order. If sparepart_list is provided, existing batch_outbound and reloc_outbound records will be deleted and new ones will be created.'
  })
  @SwaggerApiResponse({ 
    status: 200, 
    description: 'Work order updated successfully',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'null' },
        message: { type: 'string' }
      }
    }
  })
  @SwaggerApiResponse({ status: 404, description: 'Work order not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWorkOrderDto: UpdateWorkOrderDto,
    @Req() req,
  ) {
    return this.workOrderService.update(id, updateWorkOrderDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete work order by ID',
    description: 'Delete a work order and all related batch_outbound and reloc_outbound records'
  })
  @SwaggerApiResponse({ 
    status: 200, 
    description: 'Work order deleted successfully',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'null' },
        message: { type: 'string' }
      }
    }
  })
  @SwaggerApiResponse({ status: 404, description: 'Work order not found' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.workOrderService.remove(id, req.user.id);
  }
} 