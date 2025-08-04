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
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
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
import { QueryParamDto, CreateEmployeeDto } from './dto/employee.dto';

@ApiTags('Employee')
@ApiBearerAuth('jwt')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ 
    summary: 'Get all employees',
    description: 'Retrieve a paginated list of all employees with optional search functionality'
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
    description: 'Search term for employee name or ID' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved employees list',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Get all employees successfully' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'John Doe' },
              employee_id: { type: 'string', example: 'EMP001' },
              department: { type: 'string', example: 'IT' },
              position: { type: 'string', example: 'Developer' },
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
    return this.employeeService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ 
    summary: 'Get employee by ID',
    description: 'Retrieve a specific employee by their ID'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'number', 
    description: 'Employee ID',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved employee',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Employee retrieved successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'John Doe' },
            employee_id: { type: 'string', example: 'EMP001' },
            department: { type: 'string', example: 'IT' },
            position: { type: 'string', example: 'Developer' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findOne(@Param('id') id: number) {
    return this.employeeService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ 
    summary: 'Create new employee',
    description: 'Create a new employee with the provided information'
  })
  @ApiBody({ 
    type: CreateEmployeeDto,
    description: 'Employee data to create',
    examples: {
      example1: {
        summary: 'Create a new employee',
        value: {
          name: 'John Doe',
          employee_id: 'EMP001',
          department: 'IT',
          position: 'Developer',
          status: 'active'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Employee created successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Create new employee successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'John Doe' },
            employee_id: { type: 'string', example: 'EMP001' },
            department: { type: 'string', example: 'IT' },
            position: { type: 'string', example: 'Developer' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Employee ID already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  create(@Body() dto: CreateEmployeeDto) {
    return this.employeeService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ 
    summary: 'Update employee',
    description: 'Update an existing employee by ID'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'number', 
    description: 'Employee ID to update',
    example: 1
  })
  @ApiBody({ 
    type: CreateEmployeeDto,
    description: 'Updated employee data',
    examples: {
      example1: {
        summary: 'Update employee information',
        value: {
          name: 'John Doe',
          employee_id: 'EMP001',
          department: 'IT',
          position: 'Senior Developer',
          status: 'active'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Employee updated successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Employee updated successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'John Doe' },
            employee_id: { type: 'string', example: 'EMP001' },
            department: { type: 'string', example: 'IT' },
            position: { type: 'string', example: 'Senior Developer' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiResponse({ status: 409, description: 'Employee ID already in use by another employee' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  update(@Param('id') id: number, @Body() dto: CreateEmployeeDto) {
    return this.employeeService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete employee',
    description: 'Soft delete an employee by ID (marks as deleted but keeps in database)'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'number', 
    description: 'Employee ID to delete',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Employee deleted successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Employee deleted successfully' },
        data: { type: 'null', example: null }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  remove(@Param('id') id: number) {
    return this.employeeService.remove(id);
  }
}
