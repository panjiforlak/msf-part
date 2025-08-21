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
import { FormOrderService } from './form_order.service';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateFormOrderDetailDto, CreateFormOrderDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { ParamsDto } from './dto/param.dto';
import { Inventory } from '../inventory/entities/inventory.entity';

@ApiTags('Form Order')
@ApiBearerAuth('jwt')
@Controller('form-order')
export class FormOrderController {
  constructor(private readonly services: FormOrderService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: ParamsDto) {
    return this.services.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':fo_no')
  findOne(@Param('fo_no') fo_no: string) {
    return this.services.findById(fo_no);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateFormOrderDto, @Req() req) {
    return this.services.create(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':fo_no')
  update(@Param('fo_no') fo_no: string, @Body() dto: UpdateDto, @Req() req) {
    return this.services.update(fo_no, dto, req.user.id, req.user.role_code);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':fo_no/:inventory_id')
  updateFOInventory(
    @Param('fo_no') fo_no: string,
    @Param('inventory_id') inventory_id: number,
    @Body() dto: CreateFormOrderDetailDto,
    @Req() req,
  ) {
    return this.services.updateInv(fo_no, inventory_id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':fo_no')
  remove(@Param('fo_no') fo_no: string, @Req() req) {
    return this.services.remove(fo_no, req.user.id);
  }
}
