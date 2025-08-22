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
import {
  GetSettingsQueryDto,
  UpdateSettingsDto,
  CreatedSettingsDto,
} from './dto/settings.dto';

@ApiTags('Settings')
@ApiBearerAuth('jwt')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingService: SettingsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: GetSettingsQueryDto) {
    return this.settingService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.settingService.findByKey(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  update(@Body() updateDto: Record<string, string>) {
    return this.settingService.updateAll(updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatedSettingsDto) {
    return this.settingService.create(dto);
  }
}
