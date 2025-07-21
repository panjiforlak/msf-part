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

@ApiTags('Masterdata')
@ApiBearerAuth('jwt')
@Controller('masterdata')
export class MasterDataController {
  constructor(private readonly masterService: MasterService) {}

  // @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: GetMasterQueryDto) {
    return this.masterService.findAllMasterData(query);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get(':id')
  // findOne(@Param('id') id: number) {
  //   return this.masterService.findById(id);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Post()
  // create(@Body() dto: CreateMasterDto) {
  //   return this.masterService.create(dto);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Put(':id')
  // update(@Param('id') id: number, @Body() dto: UpdateMasterDto) {
  //   return this.masterService.update(id, dto);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Delete(':id')
  // remove(@Param('id') id: number) {
  //   return this.masterService.remove(id);
  // }
}
