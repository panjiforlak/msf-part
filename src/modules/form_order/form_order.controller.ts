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
import { CreateFormOrderDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { ParamsDto } from './dto/param.dto';

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
  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.services.findById(uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateFormOrderDto, @Req() req) {
    return this.services.create(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':uuid')
  update(@Param('uuid') uuid: string, @Body() dto: UpdateDto, @Req() req) {
    return this.services.update(uuid, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':uuid')
  remove(@Param('uuid') uuid: string, @Req() req) {
    return this.services.remove(uuid, req.user.id);
  }
}
