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
import { SuppliersService } from './suppliers.service';
import { JwtAuthGuard } from '../../../common/guard/jwt-auth.guard';
import { 
  ApiBearerAuth, 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiQuery,
  ApiBody 
} from '@nestjs/swagger';
import {
  GetSuppliersQueryDto,
  QueryParamDto,
  CreateSuppliersDto,
} from './dto/suppliers.dto';

@ApiTags('Suppliers')
@ApiBearerAuth('jwt')
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly services: SuppliersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ 
    summary: 'Get all suppliers',
    description: 'Retrieve a paginated list of all suppliers with optional search functionality'
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    type: String, 
    description: 'Page number for pagination' 
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: String, 
    description: 'Number of items per page' 
  })
  @ApiQuery({ 
    name: 'search', 
    required: false, 
    type: String, 
    description: 'Search term for supplier name or code' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved suppliers list',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Get all suppliers successfully' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'PT Supplier ABC' },
              code: { type: 'string', example: 'SUP001' },
              address: { type: 'string', example: 'Jl. Supplier No. 123' },
              phone: { type: 'string', example: '021-1234567' },
              email: { type: 'string', example: 'contact@supplier.com' },
              status: { type: 'string', example: 'active' }
            }
          }
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 10 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            totalPages: { type: 'number', example: 1 }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findAll(@Query() query: QueryParamDto) {
    return this.services.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ 
    summary: 'Get supplier by ID',
    description: 'Retrieve a specific supplier by their ID'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'number', 
    description: 'Supplier ID',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved supplier',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Supplier retrieved successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'PT Supplier ABC' },
            code: { type: 'string', example: 'SUP001' },
            address: { type: 'string', example: 'Jl. Supplier No. 123' },
            phone: { type: 'string', example: '021-1234567' },
            email: { type: 'string', example: 'contact@supplier.com' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Supplier not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findOne(@Param('id') id: number) {
    return this.services.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ 
    summary: 'Create new supplier',
    description: 'Create a new supplier with the provided information'
  })
  @ApiBody({ 
    type: CreateSuppliersDto,
    description: 'Supplier data to create',
    examples: {
      example1: {
        summary: 'Create a new supplier',
        value: {
          name: 'PT Supplier ABC',
          code: 'SUP001',
          address: 'Jl. Supplier No. 123',
          phone: '021-1234567',
          email: 'contact@supplier.com',
          status: 'active'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Supplier created successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Create new supplier successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'PT Supplier ABC' },
            code: { type: 'string', example: 'SUP001' },
            address: { type: 'string', example: 'Jl. Supplier No. 123' },
            phone: { type: 'string', example: '021-1234567' },
            email: { type: 'string', example: 'contact@supplier.com' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Supplier code already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  create(@Body() dto: CreateSuppliersDto, @Req() req) {
    return this.services.create(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ 
    summary: 'Update supplier',
    description: 'Update an existing supplier by ID'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'number', 
    description: 'Supplier ID to update',
    example: 1
  })
  @ApiBody({ 
    type: CreateSuppliersDto,
    description: 'Updated supplier data',
    examples: {
      example1: {
        summary: 'Update supplier information',
        value: {
          name: 'PT Supplier ABC Updated',
          code: 'SUP001',
          address: 'Jl. Supplier No. 456',
          phone: '021-7654321',
          email: 'newcontact@supplier.com',
          status: 'active'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Supplier updated successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Supplier updated successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'PT Supplier ABC Updated' },
            code: { type: 'string', example: 'SUP001' },
            address: { type: 'string', example: 'Jl. Supplier No. 456' },
            phone: { type: 'string', example: '021-7654321' },
            email: { type: 'string', example: 'newcontact@supplier.com' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Supplier not found' })
  @ApiResponse({ status: 409, description: 'Supplier code already in use by another supplier' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  update(@Param('id') id: number, @Body() dto: CreateSuppliersDto, @Req() req) {
    return this.services.update(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete supplier',
    description: 'Soft delete a supplier by ID (marks as deleted but keeps in database)'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'number', 
    description: 'Supplier ID to delete',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Supplier deleted successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Supplier deleted successfully' },
        data: { type: 'null', example: null }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Supplier not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  remove(@Param('id') id: number, @Req() req) {
    return this.services.remove(id, req.user.id);
  }
}
