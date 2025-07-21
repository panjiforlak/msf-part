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
import { MasterService } from './master.service';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateMasterDto,
  GetMasterQueryDto,
  UpdateMasterDto,
} from './dto/master.dto';

@ApiTags('Master')
@ApiBearerAuth('jwt')
@Controller('master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: GetMasterQueryDto) {
    return this.masterService.findAll(query);
  }
}
