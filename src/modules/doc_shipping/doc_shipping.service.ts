import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocShipping } from './entities/doc_shipping.entity';
import { DataSource, ILike, Not, Repository } from 'typeorm';
import {
  ApiResponse,
  successResponse,
  throwError,
} from '../../common/helpers/response.helper';
import { paginateResponse } from '../../common/helpers/public.helper';
import { plainToInstance } from 'class-transformer';
import { CreateDocShipDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { ResponseDto } from './dto/response.dto';
import { ParamsDto } from './dto/param.dto';
import { S3Service } from '../../integrations/s3/s3.service';

@Injectable()
export class DocShippingService {
  constructor(
    @InjectRepository(DocShipping)
    private repository: Repository<DocShipping>,
    private readonly s3service: S3Service,
    private readonly dataSource: DataSource,
  ) {}

  async findByDocNo(doc_ship_no: string): Promise<DocShipping | null> {
    return this.repository.findOne({
      where: [{ doc_ship_no }],
      withDeleted: false,
    });
  }

  async findAll(query: ParamsDto): Promise<ApiResponse<DocShipping[]>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;

      const [result, total] = await this.repository.findAndCount({
        where: query.search
          ? [{ doc_ship_no: ILike(`%${query.search}%`) }]
          : {},
        withDeleted: false,
        order: {
          id: 'DESC',
        },
        skip,
        take: limit,
        // relations: ['batch_inbounds'],
      });
      // const mergedResult = result.map((doc_ship) => {
      //   const {
      //     batch_inbounds: { arrival_date } = {}, // fallback default empty object
      //     ...doc_shipData
      //   } = doc_ship;

      //   return {
      //     ...doc_shipData,
      //     arrival_date,
      //   };
      // });
      return paginateResponse(
        result,
        total,
        page,
        limit,
        'Get all doc shipping susccessfuly',
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch doc shipping');
    }
  }

  async findById(slug: string): Promise<ApiResponse<any>> {
    try {
      const result: any = await this.repository.findOne({
        where: { uuid: slug },
      });

      if (!result) {
        throwError('Doc shipping Area not found', 404);
      }

      const response: any = {
        id: result.id,
        barcode: result.barcode,
        doc_ship_no: result.doc_ship_no,
        doc_ship_photo: result.doc_ship_photo,
        batch_inbounds: result.batch_inbounds,
        remarks: result.remarks,
      };

      return successResponse(response);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get doc shipping');
    }
  }

  async create(
    data: CreateDocShipDto,
    userId: number,
    uploadedFile: { key: string; url: string },
  ): Promise<ApiResponse<ResponseDto>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Cek duplikat
      const existing = await this.findByDocNo(data.doc_ship_no ?? '');
      if (existing) {
        throwError(`Doc No ${data.doc_ship_no} already exists`, 409);
      }

      if (!Array.isArray(data.items)) {
        throwError('items must be an array', 400);
      }

      // Simpan doc_shipping
      const newDocShipping = this.repository.create({
        ...data,
        doc_ship_photo: uploadedFile.url,
        createdBy: userId,
      });
      const savedDocShip = await queryRunner.manager.save(newDocShipping);

      // Simpan semua batch_inbound, sambil bawa doc_ship_id
      const batchData = data.items.map((item) => ({
        inventory_id: item.inventory_id,
        quantity: item.quantity,
        price: item.price,
        supplier_id: item.supplier_id,
        picker_id: item.picker_id,
        arrival_date: item.arrival_date,
        status_reloc: item.status_reloc,
        doc_ship_id: savedDocShip.id,
        created_by: userId,
      }));

      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into('batch_inbound')
        .values(batchData)
        .execute();

      await queryRunner.commitTransaction();

      const response = plainToInstance(ResponseDto, savedDocShip);
      return successResponse(
        response,
        'Create new doc shipping successfully',
        201,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to create doc shipping');
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    uuid: string,
    updateDto: UpdateDto,
    userId: number,
  ): Promise<ApiResponse<DocShipping>> {
    try {
      const docShip = await this.repository.findOne({
        where: { uuid },
      });

      if (!docShip) {
        throwError('Doc Shipping not found', 404);
      }
      if (updateDto.doc_ship_no) {
        const existingCheck = await this.repository.findOne({
          where: {
            doc_ship_no: updateDto.doc_ship_no,
            uuid: Not(uuid),
          },
        });
        if (existingCheck) {
          throwError('Doc Shipping No already in use by another Docs', 409);
        }
      }
      const updatedBody = this.repository.merge(docShip!, updateDto, {
        updatedBy: userId,
      });

      const result = await this.repository.save(updatedBody);

      const response: any = {
        id: result.id,
      };
      return successResponse(response, 'Doc Shipping updated successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update Doc Shipping');
    }
  }

  async remove(uuid: string, userId: number): Promise<ApiResponse<null>> {
    try {
      const items = await this.repository.findOne({
        where: { uuid },
      });

      if (!items) {
        throwError('Doc Shipping not found', 404);
      }

      items!.deletedBy = userId;

      await this.repository.save(items!);
      await this.repository.softRemove(items!);

      return successResponse(null, 'Doc Shipping deleted successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error.stack);
      throw new InternalServerErrorException('Failed to delete Doc Shipping');
    }
  }
}
