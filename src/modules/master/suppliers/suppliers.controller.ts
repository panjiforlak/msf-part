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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
  findAll(@Query() query: QueryParamDto) {
    return this.services.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.services.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateSuppliersDto, @Req() req) {
    return this.services.create(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() dto: CreateSuppliersDto, @Req() req) {
    return this.services.update(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @Req() req) {
    return this.services.remove(id, req.user.id);
  }
}
