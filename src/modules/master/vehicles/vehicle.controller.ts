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
import { VehicleService } from './vehicle.service';
import { JwtAuthGuard } from '../../../common/guard/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import {
  GetVehicleQueryDto,
  QueryParamDto,
  CreateVehiclesDto,
} from './dto/vehicle.dto';

@ApiTags('Vehicles')
@ApiBearerAuth('jwt')
@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Get all vehicles',
    description:
      'Retrieve a paginated list of all vehicles with optional search functionality',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: String,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: String,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for VIN number or vehicle number',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved vehicles list',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Get all vehicle successfully' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              vin_number: { type: 'string', example: 'VIN123456789' },
              vehicle_number: { type: 'string', example: 'B1234ABC' },
              brand: { type: 'string', example: 'Toyota' },
              type: { type: 'string', example: 'Truck' },
              capacity_ton: { type: 'string', example: '5' },
              status: { type: 'string', example: 'active' },
            },
          },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 10 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            totalPages: { type: 'number', example: 1 },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findAll(@Query() query: QueryParamDto) {
    return this.vehicleService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Get vehicle by ID',
    description: 'Retrieve a specific vehicle by its ID',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Vehicle ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved vehicle',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Vehicle retrieved successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            vin_number: { type: 'string', example: 'VIN123456789' },
            vehicle_number: { type: 'string', example: 'B1234ABC' },
            brand: { type: 'string', example: 'Toyota' },
            type: { type: 'string', example: 'Truck' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findOne(@Param('id') id: number) {
    return this.vehicleService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({
    summary: 'Create new vehicle',
    description: 'Create a new vehicle with the provided information',
  })
  @ApiBody({
    type: CreateVehiclesDto,
    description: 'Vehicle data to create',
    examples: {
      example1: {
        summary: 'Create a new truck',
        value: {
          vin_number: 'VIN123456789',
          vehicle_number: 'B1234ABC',
          brand: 'Toyota',
          type: 'Truck',
          capacity_ton: '5',
          status: 'active',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Vehicle created successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'Create new vehicles successfully',
        },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            vin_number: { type: 'string', example: 'VIN123456789' },
            vehicle_number: { type: 'string', example: 'B1234ABC' },
            brand: { type: 'string', example: 'Toyota' },
            type: { type: 'string', example: 'Truck' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 409,
    description: 'VIN number or vehicle number already exists',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  create(@Body() dto: CreateVehiclesDto) {
    return this.vehicleService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({
    summary: 'Update vehicle',
    description: 'Update an existing vehicle by ID',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Vehicle ID to update',
    example: 1,
  })
  @ApiBody({
    type: CreateVehiclesDto,
    description: 'Updated vehicle data',
    examples: {
      example1: {
        summary: 'Update vehicle information',
        value: {
          vin_number: 'VIN123456789',
          vehicle_number: 'B1234ABC',
          brand: 'Toyota',
          type: 'Truck',
          capacity_ton: '5',
          status: 'active',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Vehicle updated successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Vehicles updated successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            vin_number: { type: 'string', example: 'VIN123456789' },
            vehicle_number: { type: 'string', example: 'B1234ABC' },
            brand: { type: 'string', example: 'Toyota' },
            type: { type: 'string', example: 'Truck' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  @ApiResponse({
    status: 409,
    description: 'VIN number already in use by another vehicle',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  update(@Param('id') id: number, @Body() dto: CreateVehiclesDto) {
    return this.vehicleService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete vehicle',
    description:
      'Soft delete a vehicle by ID (marks as deleted but keeps in database)',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Vehicle ID to delete',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Vehicle deleted successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'boolean', example: true },
        message: { type: 'string', example: 'vehicles deleted successfully' },
        data: { type: 'null', example: null },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  remove(@Param('id') id: number, @Req() req) {
    return this.vehicleService.remove(id, req.user.id);
  }
}
