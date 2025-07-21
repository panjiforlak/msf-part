import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { MasterService } from './master.service';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetMasterQueryDto } from './dto/master.dto';

@ApiTags('Masterdata')
@ApiBearerAuth('jwt')
@Controller('masterdata')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: GetMasterQueryDto) {
    return this.masterService.findAllMasterData(query);
  }
}
