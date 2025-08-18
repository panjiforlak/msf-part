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
import { ActivityService } from './activity.service';
import { JwtAuthGuard } from '../../../common/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateActivityDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { ParamsDto } from './dto/param.dto';

@ApiTags('Activity')
@ApiBearerAuth('jwt')
@Controller('activity')
export class ActivityController {
  constructor(private readonly services: ActivityService) {}

  @ApiTags('Activity Get All')
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: ParamsDto) {
    return this.services.findAll(query);
  }

  @ApiTags('Activity Detail')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.services.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateActivityDto, @Req() req) {
    return this.services.create(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateDto, @Req() req) {
    return this.services.update(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @Req() req) {
    return this.services.remove(id, req.user.id);
  }
}
