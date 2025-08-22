import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ParamsDto } from './dto/param.dto';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard Count')
@ApiBearerAuth('jwt')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly services: DashboardService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/count')
  count(@Query() query: ParamsDto) {
    return this.services.findAll(query);
  }
}
