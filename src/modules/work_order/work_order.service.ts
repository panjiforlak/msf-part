import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderForm, WorkOrderStatus } from './entities/order_form.entity';
import { BatchOutbound, batchout_type } from './entities/batch_outbound.entity';
import { RelocOutbound } from './entities/reloc_outbound.entity';
import { BatchInbound } from '../batch_in/entities/batchin.entity';
import { ILike, Repository } from 'typeorm';
import {
  ApiResponse,
  successResponse,
  throwError,
} from '../../common/helpers/response.helper';
import { paginateResponse } from '../../common/helpers/public.helper';
import { plainToInstance } from 'class-transformer';
import { CreateWorkOrderDto } from './dto/create.dto';
import { UpdateWorkOrderDto } from './dto/update.dto';
import { WorkOrderResponseDto } from './dto/response.dto';
import { ParamsDto } from './dto/param.dto';
import { ApprovalDto, ApprovalStatus } from './dto/approval.dto';
import { AssignPickerDto } from './dto/assign-picker.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class WorkOrderService {
  constructor(
    @InjectRepository(OrderForm)
    private orderFormRepository: Repository<OrderForm>,
    @InjectRepository(BatchOutbound)
    private batchOutboundRepository: Repository<BatchOutbound>,
    @InjectRepository(RelocOutbound)
    private relocOutboundRepository: Repository<RelocOutbound>,
    @InjectRepository(BatchInbound)
    private batchInboundRepository: Repository<BatchInbound>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    query: ParamsDto,
  ): Promise<ApiResponse<WorkOrderResponseDto[]>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;

      let result = [];
      let total = 0;

      try {
        // Try to get data from order_form table
        const qb = this.dataSource
          .createQueryBuilder()
          .select([
            'of.id AS id',
            "COALESCE(v.vin_number, 'N/A') AS vin_number",
            "COALESCE(CONCAT(d.first_name, ' ', d.last_name), 'N/A') AS driver",
            "COALESCE(CONCAT(m.first_name, ' ', m.last_name), 'N/A') AS mechanic",
            "COALESCE(CONCAT(r.first_name, ' ', r.last_name), 'N/A') AS request",
            'of.departement AS departement',
            'of.remark AS remark',
            'of.start_date AS start_date',
            'of.end_date AS end_date',
            'of.status AS status',
            // Audit fields commented out
            // 'of."createdBy" AS "createdBy"',
            // 'of."createdAt" AS "createdAt"',
            // 'of."updatedBy" AS "updatedBy"',
            // 'of."updatedAt" AS "updatedAt"',
            // 'of."deletedBy" AS "deletedBy"',
            // 'of."deletedAt" AS "deletedAt"',
          ])
          .from('order_form', 'of')
          .leftJoin('vehicles', 'v', 'of.vehicle_id = v.id')
          .leftJoin('employee', 'd', 'of.driver_id = d.id')
          .leftJoin('employee', 'm', 'of.mechanic_id = m.id')
          .leftJoin('employee', 'r', 'of.request_id = r.id');
        // .where('of."deletedAt" IS NULL'); // Commented out since deletedAt doesn't exist

        if (query.search) {
          qb.andWhere("LOWER(COALESCE(v.vin_number, '')) LIKE :search", {
            search: `%${query.search.toLowerCase()}%`,
          });
        }

        result = await qb
          .orderBy('of.id', 'DESC')
          .offset(skip)
          .limit(limit)
          .getRawMany();

        // Create separate query for count
        const countQb = this.dataSource
          .createQueryBuilder()
          .select('COUNT(of.id)', 'count')
          .from('order_form', 'of')
          .leftJoin('vehicles', 'v', 'of.vehicle_id = v.id')
          .leftJoin('employee', 'd', 'of.driver_id = d.id')
          .leftJoin('employee', 'm', 'of.mechanic_id = m.id')
          .leftJoin('employee', 'r', 'of.request_id = r.id');
        // .where('of."deletedAt" IS NULL'); // Commented out since deletedAt doesn't exist

        if (query.search) {
          countQb.andWhere("LOWER(COALESCE(v.vin_number, '')) LIKE :search", {
            search: `%${query.search.toLowerCase()}%`,
          });
        }

        const totalResult = await countQb.getRawOne();
        total = parseInt(totalResult?.count || '0');
      } catch (dbError) {
        // If there's any database error (table doesn't exist, etc.), just return empty result
        console.log(
          'Database error in findAll, returning empty result:',
          dbError.message,
        );
        result = [];
        total = 0;
      }

      return paginateResponse(
        result,
        total,
        page,
        limit,
        result.length > 0
          ? 'Get all work orders successfully'
          : 'No work orders found',
      );
    } catch (error) {
      console.error('Error in findAll:', error);
      // Return empty result instead of throwing error
      return paginateResponse(
        [],
        0,
        parseInt(query.page ?? '1', 10),
        parseInt(query.limit ?? '10', 10),
        'No work orders found',
      );
    }
  }

  async findOne(id: number): Promise<ApiResponse<WorkOrderResponseDto | null>> {
    try {
      let orderForm: any = null;
      let sparepartList: any[] = [];

      try {
        const qb = this.dataSource
          .createQueryBuilder()
          .select([
            'of.id AS id',
            'of.vehicle_id AS vin_number',
            'of.driver_id AS driver',
            'of.mechanic_id AS mechanic',
            'of.request_id AS request',
            'of.departement AS departement',
            'of.remark AS remark',
            'of.start_date AS start_date',
            'of.end_date AS end_date',
            'of.status AS status',
          ])
          .from('order_form', 'of')
          .where('of.id = :id', { id });

        orderForm = await qb.getRawOne();

        if (orderForm) {
          // Get sparepart list - menggunakan batch_outbound untuk mendapatkan sparepart yang terkait dengan work order
          sparepartList = await this.dataSource
            .createQueryBuilder()
            .select([
              'bo.id AS id',
              'bo.inventory_id AS part_name',
              'ro.reloc_to AS destination',
              'bo.quantity AS quantity',
              'of.start_date AS start_date',
              'i.inventory_internal_code AS part_number',
              'i.inventory_name AS part_name_label',
              'of.remark AS remark',
              "'Ready' AS status",
              "COALESCE(sa.barcode, 'N/A') AS racks_name",
            ])
            .from('batch_outbound', 'bo')
            .leftJoin(
              'reloc_outbound',
              'ro',
              'ro.batch_in_id IN (SELECT bi.id FROM batch_inbound bi WHERE bi.inventory_id = bo.inventory_id)',
            )
            .leftJoin('order_form', 'of', 'bo.order_form_id = of.id')
            .leftJoin('inventory', 'i', 'bo.inventory_id = i.id')
            .leftJoin('storage_area', 'sa', 'i.racks_id = sa.id')
            .where('bo.order_form_id = :orderId', { orderId: orderForm.id })
            .getRawMany();
        }
      } catch (dbError) {
        console.log(
          'Database error in findOne, returning not found:',
          dbError.message,
        );
        orderForm = null;
        sparepartList = [];
      }

      if (!orderForm) {
        return successResponse(null, 'Work order not found');
      }

      const result = {
        ...orderForm,
        sparepart_list: sparepartList,
      };

      return successResponse(result, 'Get work order successfully');
    } catch (error) {
      console.error('Error in findOne:', error);
      return successResponse(null, 'Work order not found');
    }
  }

  async create(
    createWorkOrderDto: CreateWorkOrderDto,
    userId: number,
  ): Promise<ApiResponse<WorkOrderResponseDto>> {
    try {
      console.log('Creating work order with data:', {
        ...createWorkOrderDto,
        userId,
      });

      let savedOrderForm: any = null;

      await this.dataSource.transaction(async (manager) => {
        try {
          // 1. Create order form
          const orderForm = manager.create(OrderForm, {
            vehicle_id: createWorkOrderDto.vin_number,
            admin_id: userId,
            driver_id: createWorkOrderDto.driver,
            mechanic_id: createWorkOrderDto.mechanic,
            request_id: createWorkOrderDto.request,
            departement: createWorkOrderDto.departement,
            remark: createWorkOrderDto.remark,
            start_date: new Date(createWorkOrderDto.start_date),
            end_date: new Date(createWorkOrderDto.end_date),
            status: createWorkOrderDto.status,
            createdBy: userId,
          });

          console.log('Order form created:', orderForm);
          savedOrderForm = await manager.save(orderForm);
          console.log('Order form saved:', savedOrderForm);

          // 2. Create batch outbound for each sparepart
          for (const sparepart of createWorkOrderDto.sparepart_list) {
            console.log('Processing sparepart:', sparepart);

            const batchOutbound = manager.create(BatchOutbound, {
              inventory_id: sparepart.part_name,
              order_form_id: savedOrderForm.id, // Link to order_form
              quantity: sparepart.quantity,
              status: batchout_type.OUTBOUND,
              createdBy: userId,
            });

            console.log('Batch outbound created:', batchOutbound);
            const savedBatchOutbound = await manager.save(batchOutbound);
            console.log('Batch outbound saved:', savedBatchOutbound);

            // 3. Get batch_inbound data berdasarkan inventory_id
            console.log(
              'Searching for batch_inbound with inventory_id:',
              sparepart.part_name,
              'type:',
              typeof sparepart.part_name,
            );

            // First, let's check if there are any batch_inbound records at all
            const allBatchInbounds = await manager
              .createQueryBuilder()
              .select('bi.id, bi.inventory_id')
              .from('batch_inbound', 'bi')
              .limit(10)
              .getRawMany();

            console.log(
              'All batch_inbound records (first 10):',
              allBatchInbounds,
            );
            const batchInbounds = await manager
              .createQueryBuilder()
              .select('bi.id, bi.inventory_id')
              .from('batch_inbound', 'bi')
              .where('bi.inventory_id = :inventoryId', {
                inventoryId: sparepart.part_name,
              })
              .getRawMany();

            console.log(
              'Batch inbounds found for inventory_id',
              sparepart.part_name,
              ':',
              batchInbounds,
            );

            // 4. Get racks_id from inventory
            const inventory = await manager
              .createQueryBuilder()
              .select('i.racks_id')
              .from('inventory', 'i')
              .where('i.id = :id', { id: sparepart.part_name })
              .getOne();

            console.log('Inventory found:', inventory);

            // 5. Create reloc outbound untuk setiap batch_inbound
            // Jika ada banyak batch_inbound dengan inventory_id yang sama,
            // maka akan dibuat banyak row di reloc_outbound
            if (batchInbounds && batchInbounds.length > 0) {
              console.log(
                'Creating reloc outbound for',
                batchInbounds.length,
                'batch_inbound records',
              );
              for (const batchInbound of batchInbounds) {
                const relocOutboundData = {
                  batch_in_id: batchInbound.id,
                  reloc_from: inventory?.racks_id || 0,
                  reloc_to: sparepart.destination,
                  quantity: sparepart.quantity,
                  reloc_date: new Date(createWorkOrderDto.start_date),
                  createdBy: userId,
                };

                console.log(
                  'Reloc outbound data to be created:',
                  relocOutboundData,
                );

                const relocOutbound = manager.create(
                  RelocOutbound,
                  relocOutboundData,
                );

                console.log(
                  'Reloc outbound created for batch_in_id:',
                  batchInbound.id,
                );
                const savedRelocOutbound = await manager.save(relocOutbound);
                console.log(
                  'Reloc outbound saved successfully for batch_in_id:',
                  batchInbound.id,
                  'with ID:',
                  savedRelocOutbound.id,
                );
              }
            } else {
              console.log(
                'No batch_inbound found for inventory_id:',
                sparepart.part_name,
              );
            }
          }

          console.log('Transaction completed successfully');
        } catch (transactionError) {
          console.error('Error in transaction:', transactionError);
          throw transactionError;
        }
      });

      return successResponse(
        savedOrderForm,
        'Work order created successfully',
        201,
      );
    } catch (error) {
      console.error('Error in create work order:', error);

      // Check for specific database errors
      if (error.code === '23505') {
        // Unique constraint violation
        throw new HttpException(
          'Work order with this data already exists',
          400,
        );
      } else if (error.code === '23503') {
        // Foreign key constraint violation
        throw new HttpException(
          'Invalid reference data (vehicle, employee, or inventory not found)',
          400,
        );
      } else if (error.code === '22P02') {
        // Invalid text representation
        throw new HttpException('Invalid data format provided', 400);
      }

      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to create work order');
    }
  }

  async update(
    id: number,
    updateWorkOrderDto: UpdateWorkOrderDto,
    userId: number,
  ): Promise<ApiResponse<WorkOrderResponseDto>> {
    try {
      const orderForm = await this.orderFormRepository.findOne({
        where: { id },
        withDeleted: false,
      });

      if (!orderForm) {
        throwError('Work order not found', 404);
      }

      await this.dataSource.transaction(async (manager) => {
        // 1. Update order form
        const updatedOrderForm = manager.merge(OrderForm, orderForm!, {
          ...updateWorkOrderDto,
          vehicle_id: updateWorkOrderDto.vin_number || orderForm!.vehicle_id,
          driver_id: updateWorkOrderDto.driver || orderForm!.driver_id,
          mechanic_id: updateWorkOrderDto.mechanic || orderForm!.mechanic_id,
          request_id: updateWorkOrderDto.request || orderForm!.request_id,
        });

        await manager.save(updatedOrderForm);

        // 2. Delete existing batch outbound and reloc outbound
        if (updateWorkOrderDto.sparepart_list) {
          // Delete existing reloc outbound
          await manager
            .createQueryBuilder()
            .delete()
            .from('reloc_outbound')
            .where(
              'batch_in_id IN (SELECT bi.id FROM batch_inbound bi WHERE bi.inventory_id IN (SELECT bo.inventory_id FROM batch_outbound bo WHERE bo.order_form_id = :orderId))',
              {
                orderId: orderForm!.id,
              },
            )
            .execute();

          // Delete existing batch outbound
          await manager
            .createQueryBuilder()
            .delete()
            .from('batch_outbound')
            .where('order_form_id = :orderId', {
              orderId: orderForm!.id,
            })
            .execute();

          // 3. Create new batch outbound and reloc outbound
          for (const sparepart of updateWorkOrderDto.sparepart_list) {
            const batchOutbound = manager.create(BatchOutbound, {
              inventory_id: sparepart.part_name,
              order_form_id: orderForm!.id, // Link to order_form
              quantity: sparepart.quantity,
              status: batchout_type.OUTBOUND,
              // createdBy: userId, // Commented out since createdBy doesn't exist
            });

            const savedBatchOutbound = await manager.save(batchOutbound);

            // Get batch_inbound data berdasarkan inventory_id
            const batchInbounds = await manager
              .createQueryBuilder()
              .select('bi.id, bi.inventory_id')
              .from('batch_inbound', 'bi')
              .where('bi.inventory_id = :inventoryId', {
                inventoryId: sparepart.part_name,
              })
              .getMany();

            // Get racks_id from inventory
            const inventory = await manager
              .createQueryBuilder()
              .select('i.racks_id')
              .from('inventory', 'i')
              .where('i.id = :id', { id: sparepart.part_name })
              .getOne();

            // Create reloc outbound untuk setiap batch_inbound
            if (batchInbounds && batchInbounds.length > 0) {
              for (const batchInbound of batchInbounds) {
                const relocOutbound = manager.create(RelocOutbound, {
                  batch_in_id: batchInbound.id,
                  reloc_from: inventory?.racks_id || 0,
                  reloc_to: sparepart.destination,
                  quantity: sparepart.quantity,
                });

                await manager.save(relocOutbound);
              }
            }
          }
        }
      });

      return successResponse(
        {} as WorkOrderResponseDto,
        'Work order updated successfully',
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update work order');
    }
  }

  async remove(id: number, userId: number): Promise<ApiResponse<null>> {
    try {
      const orderForm = await this.orderFormRepository.findOne({
        where: { id },
        withDeleted: false,
      });

      if (!orderForm) {
        throwError('Work order not found', 404);
      }

      await this.dataSource.transaction(async (manager) => {
        // 1. Delete reloc outbound
        await manager
          .createQueryBuilder()
          .delete()
          .from('reloc_outbound')
          .where(
            'batch_in_id IN (SELECT bi.id FROM batch_inbound bi WHERE bi.inventory_id IN (SELECT bo.inventory_id FROM batch_outbound bo WHERE bo.order_form_id = :orderId))',
            {
              orderId: orderForm!.id,
            },
          )
          .execute();

        // 2. Delete batch outbound
        await manager
          .createQueryBuilder()
          .delete()
          .from('batch_outbound')
          .where('order_form_id = :orderId', {
            orderId: orderForm!.id,
          })
          .execute();

        // 3. Delete order form
        await manager.remove(orderForm);
      });

      return successResponse(null, 'Work order deleted successfully');
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to delete work order');
    }
  }

  async approval(
    id: number,
    approvalDto: ApprovalDto,
    userId: number,
  ): Promise<ApiResponse<WorkOrderResponseDto>> {
    try {
      const orderForm = await this.orderFormRepository.findOne({
        where: { id },
        withDeleted: false,
      });

      if (!orderForm) {
        throwError('Work order not found', 404);
      }

      // Jika status approval, update status menjadi 'in_progress'
      if (approvalDto.status === ApprovalStatus.APPROVAL) {
        await this.orderFormRepository.update(id, {
          status: WorkOrderStatus.IN_PROGRESS,
        });

        // Update remarks di tabel batch_outbound jika ada remark
        if (approvalDto.remark) {
          await this.batchOutboundRepository.update(
            { order_form_id: id },
            { remarks: approvalDto.remark },
          );
        }

        return successResponse(
          {} as WorkOrderResponseDto,
          'Work order approved successfully',
        );
      } else {
        // Jika reject, tidak mengupdate data
        return successResponse(
          {} as WorkOrderResponseDto,
          'Work order rejected',
        );
      }
    } catch (error) {
      console.error('Approval error:', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        error.message || 'Failed to process approval',
      );
    }
  }

  async assignPicker(
    id: number,
    assignPickerDto: AssignPickerDto,
    userId: number,
  ): Promise<ApiResponse<WorkOrderResponseDto>> {
    try {
      // Validasi work order exists
      const orderForm = await this.orderFormRepository.findOne({
        where: { id },
        withDeleted: false,
      });

      if (!orderForm) {
        throwError('Work order not found', 404);
      }

      // Validasi picker_id exists di tabel employee
      const employeeExists = await this.dataSource
        .createQueryBuilder()
        .select('1')
        .from('employee', 'e')
        .where('e.id = :pickerId', { pickerId: assignPickerDto.picker_id })
        .getRawOne();

      if (!employeeExists) {
        throwError('Picker ID tidak ditemukan di tabel employee', 400);
      }

      // Update picker_id di semua reloc_outbound yang terkait dengan work order ini
      await this.dataSource
        .createQueryBuilder()
        .update('reloc_outbound')
        .set({ picker_id: assignPickerDto.picker_id })
        .where(
          'batch_in_id IN (SELECT bi.id FROM batch_inbound bi WHERE bi.inventory_id IN (SELECT bo.inventory_id FROM batch_outbound bo WHERE bo.order_form_id = :orderId))',
          {
            orderId: id,
          },
        )
        .execute();

      return successResponse(
        {} as WorkOrderResponseDto,
        'Picker assigned successfully',
      );
    } catch (error) {
      console.error('Assign picker error:', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        error.message || 'Failed to assign picker',
      );
    }
  }

  async testConnection(): Promise<ApiResponse<any>> {
    try {
      // Get table structure
      const orderFormColumns = await this.dataSource
        .createQueryBuilder()
        .select('column_name, data_type, is_nullable')
        .from('information_schema.columns', 'c')
        .where('c.table_name = :tableName', { tableName: 'order_form' })
        .getRawMany();

      const batchOutboundColumns = await this.dataSource
        .createQueryBuilder()
        .select('column_name, data_type, is_nullable')
        .from('information_schema.columns', 'c')
        .where('c.table_name = :tableName', { tableName: 'batch_outbound' })
        .getRawMany();

      const relocOutboundColumns = await this.dataSource
        .createQueryBuilder()
        .select('column_name, data_type, is_nullable')
        .from('information_schema.columns', 'c')
        .where('c.table_name = :tableName', { tableName: 'reloc_outbound' })
        .getRawMany();

      const batchInboundColumns = await this.dataSource
        .createQueryBuilder()
        .select('column_name, data_type, is_nullable')
        .from('information_schema.columns', 'c')
        .where('c.table_name = :tableName', { tableName: 'batch_inbound' })
        .getRawMany();

      // Test if tables exist
      const orderFormExists = await this.dataSource
        .createQueryBuilder()
        .select('1')
        .from('order_form', 'of')
        .limit(1)
        .getRawOne();

      const batchOutboundExists = await this.dataSource
        .createQueryBuilder()
        .select('1')
        .from('batch_outbound', 'bo')
        .limit(1)
        .getRawOne();

      const relocOutboundExists = await this.dataSource
        .createQueryBuilder()
        .select('1')
        .from('reloc_outbound', 'ro')
        .limit(1)
        .getRawOne();

      const batchInboundExists = await this.dataSource
        .createQueryBuilder()
        .select('1')
        .from('batch_inbound', 'bi')
        .limit(1)
        .getRawOne();

      // Get sample data from batch_inbound
      const batchInboundSample = await this.dataSource
        .createQueryBuilder()
        .select('bi.id, bi.inventory_id, bi.quantity')
        .from('batch_inbound', 'bi')
        .limit(5)
        .getRawMany();

      // Get sample data from batch_outbound for work order 20
      const batchOutboundSample = await this.dataSource
        .createQueryBuilder()
        .select('bo.id, bo.inventory_id, bo.order_form_id, bo.quantity')
        .from('batch_outbound', 'bo')
        .where('bo.order_form_id = 20')
        .getRawMany();

      // Get sample data from reloc_outbound for work order 20
      const relocOutboundSample = await this.dataSource
        .createQueryBuilder()
        .select(
          'ro.id, ro.batch_in_id, ro.reloc_from, ro.reloc_to, ro.quantity',
        )
        .from('reloc_outbound', 'ro')
        .where(
          'ro.batch_in_id IN (SELECT bi.id FROM batch_inbound bi WHERE bi.inventory_id IN (SELECT bo.inventory_id FROM batch_outbound bo WHERE bo.order_form_id = 20))',
        )
        .getRawMany();

      return successResponse(
        {
          order_form: {
            exists: !!orderFormExists,
            columns: orderFormColumns,
          },
          batch_outbound: {
            exists: !!batchOutboundExists,
            columns: batchOutboundColumns,
            sample_data_for_wo_20: batchOutboundSample,
          },
          reloc_outbound: {
            exists: !!relocOutboundExists,
            columns: relocOutboundColumns,
            sample_data_for_wo_20: relocOutboundSample,
          },
          batch_inbound: {
            exists: !!batchInboundExists,
            columns: batchInboundColumns,
            sample_data: batchInboundSample,
          },
          message: 'Database structure analysis completed',
        },
        'Database structure analysis successful',
      );
    } catch (error) {
      console.error('Error in testConnection:', error);
      return successResponse(
        {
          error: error.message,
          message: 'Database structure analysis failed',
        },
        'Database structure analysis failed',
        500,
      );
    }
  }
}
