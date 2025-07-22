import {
  Controller,
  Get,
  UseGuards,
  Query,
  Post,
  Body,
  Put,
  Param,
} from '@nestjs/common';
import { MasterService } from './master.service';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  GetMasterQueryDto,
  CreateMasterDto,
  UpdateMasterDto,
} from './dto/master.dto';

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

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateMasterDto) {
    return this.masterService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() dto: CreateMasterDto) {
    return this.masterService.update(id, dto);
  }
}
