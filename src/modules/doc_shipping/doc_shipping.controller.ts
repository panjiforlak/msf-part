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
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DocShippingService } from './doc_shipping.service';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { ParamsDto } from './dto/param.dto';
import { S3Service } from '../../integrations/s3/s3.service';
import { MemoryFileInterceptor } from 'src/common/interceptors/logger.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('DocShipping')
@ApiBearerAuth('jwt')
@Controller('doc-shipping')
export class DocShippingController {
  constructor(
    private readonly services: DocShippingService,
    private readonly s3services: S3Service,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: ParamsDto) {
    return this.services.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.services.findById(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(MemoryFileInterceptor())
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateDto,
    @Req() req,
  ) {
    const uploaded = await this.s3services.uploadFile(file, 'doc-shipping');
    return this.services.create(dto, req.user.id, uploaded);
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
