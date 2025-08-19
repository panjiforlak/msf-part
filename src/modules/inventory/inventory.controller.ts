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
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateInventoryDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { ParamsDto } from './dto/param.dto';
import { MemoryFileInterceptor } from 'src/common/interceptors/logger.interceptor';
import { S3Service } from 'src/integrations/s3/s3.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Inventory')
@ApiBearerAuth('jwt')
@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly services: InventoryService,
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(MemoryFileInterceptor('inventory_photo'))
  @Post()
  async create(
    @UploadedFile() inventory_photo: Express.Multer.File,
    @Body() dto: CreateInventoryDto,
    @Req() req,
  ) {
    const inventoryPhoto = await this.s3services.uploadFile(
      inventory_photo,
      'inventories',
    );
    return this.services.create(dto, req.user.id, inventoryPhoto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(MemoryFileInterceptor('inventory_photo'))
  @Put(':uuid')
  async update(
    @Param('uuid') uuid: string,
    @UploadedFile() inventory_photo: Express.Multer.File,
    @Body() dto: UpdateDto,
    @Req() req,
  ) {
    let inventoryPhoto;
    if (inventory_photo) {
      inventoryPhoto = await this.s3services.uploadFile(
        inventory_photo,
        'inventories',
      );
    }
    return this.services.update(uuid, dto, req.user.id, inventoryPhoto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':uuid')
  remove(@Param('uuid') uuid: string, @Req() req) {
    return this.services.remove(uuid, req.user.id);
  }
}
