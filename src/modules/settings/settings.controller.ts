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
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetSettingsQueryDto } from './dto/settings.dto';

@ApiTags('Roles')
@ApiBearerAuth('jwt')
@Controller('roles')
export class SettingsController {
  constructor(private readonly settingService: SettingsService) {}

  //   @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: GetSettingsQueryDto) {
    return this.settingService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.settingService.findById(id);
  }

  //   @UseGuards(JwtAuthGuard)
  //   @Post()
  //   create(@Body() dto: CreateRolesDto) {
  //     return this.settingService.create(dto);
  //   }

  // @UseGuards(JwtAuthGuard)
  // @Put(':id')
  // update(@Param('id') id: number, @Body() dto: UpdateRolesDto) {
  //   return this.settingService.update(id, dto);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Delete(':id')
  // remove(@Param('id') id: number) {
  //   return this.settingService.remove(id);
  // }
}
