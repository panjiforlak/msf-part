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
import { WorkingareaService } from './workingarea.service';
import { JwtAuthGuard } from '../../../common/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  GetSuppliersQueryDto,
  QueryParamDto,
} from './dto.backup/workingarea.dto';

import { CreateDto } from './dto/create.dto';

@ApiTags('Workingarea')
@ApiBearerAuth('jwt')
@Controller('workingarea')
export class WorkingareaController {
  constructor(private readonly services: WorkingareaService) {}

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
  create(@Body() dto: CreateDto, @Req() req) {
    return this.services.create(dto, req.user.id);
  }

  // @UseGuards(JwtAuthGuard)
  // @Put(':id')
  // update(@Param('id') id: number, @Body() dto: CreateDto, @Req() req) {
  //   return this.services.update(id, dto, req.user.id);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Delete(':id')
  // remove(@Param('id') id: number, @Req() req) {
  //   return this.services.remove(id, req.user.id);
  // }
}
