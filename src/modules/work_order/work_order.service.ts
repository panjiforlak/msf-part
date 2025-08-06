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
            "COALESCE(dr.name, 'N/A') AS driver",
            "COALESCE(mc.name, 'N/A') AS mechanic",
            "COALESCE(pk.name, 'N/A') AS picker",
            "COALESCE(req.name, 'N/A') AS request",
            "COALESCE(ap.name, 'N/A') AS approval_by",
            'of.departement AS departement',
            'of.remark AS remark',
            'of.order_type AS order_type',
            'of.start_date AS start_date',
            'of.end_date AS end_date',
            'of.status AS status',
            'of.approval_remark AS approval_remark',
          ])
          .from('order_form', 'of')
          .leftJoin('vehicles', 'v', 'of.vehicle_id = v.id')
          .leftJoin('users', 'dr', 'of.driver_id = dr.id')
          .leftJoin('users', 'mc', 'of.mechanic_id = mc.id')
          .leftJoin('users', 'pk', 'of.picker_id = pk.id')
          .leftJoin('users', 'req', 'of.request_id = req.id')
          .leftJoin('users', 'ap', 'of.approval_by = ap.id');
        // .where('of."deletedAt" IS NULL'); // Commented out since deletedAt doesn't exist

        if (query.search) {
          qb.andWhere("LOWER(COALESCE(v.vin_number, '')) LIKE :search", {
            search: `%${query.search.toLowerCase()}%`,
          });
        }

        if (query.order_type) {
          qb.andWhere('of.order_type = :orderType', {
            orderType: query.order_type,
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
          .leftJoin('users', 'dr', 'of.driver_id = dr.id')
          .leftJoin('users', 'mc', 'of.mechanic_id = mc.id')
          .leftJoin('users', 'pk', 'of.picker_id = pk.id')
          .leftJoin('users', 'req', 'of.request_id = req.id')
          .leftJoin('users', 'ap', 'of.approval_by = ap.id');
        // .where('of."deletedAt" IS NULL'); // Commented out since deletedAt doesn't exist

        if (query.search) {
          countQb.andWhere("LOWER(COALESCE(v.vin_number, '')) LIKE :search", {
            search: `%${query.search.toLowerCase()}%`,
          });
        }

        if (query.order_type) {
          countQb.andWhere('of.order_type = :orderType', {
            orderType: query.order_type,
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
            "COALESCE(v.vin_number, 'N/A') AS vin_number",
            "COALESCE(dr.name, 'N/A') AS driver",
            "COALESCE(mc.name, 'N/A') AS mechanic",
            "COALESCE(req.name, 'N/A') AS request",
            'of.departement AS departement',
            'of.remark AS remark',
            'of.order_type AS order_type',
            'of.start_date AS start_date',
            'of.end_date AS end_date',
            'of.status AS status',
            'of.approval_remark AS approval_remark',
          ])
          .from('order_form', 'of')
          .leftJoin('vehicles', 'v', 'of.vehicle_id = v.id')
          .leftJoin('users', 'dr', 'of.driver_id = dr.id')
          .leftJoin('users', 'mc', 'of.mechanic_id = mc.id')
          .leftJoin('users', 'req', 'of.request_id = req.id')
          .where('of.id = :id', { id });

        orderForm = await qb.getRawOne();

        if (orderForm) {
          // Get sparepart list - menggunakan batch_outbound untuk mendapatkan sparepart yang terkait dengan work order
          const rawSparepartList = await this.dataSource
            .createQueryBuilder()
            .select([
              'bo.id AS id',
              'bo.inventory_id AS inventory_id',
              'COALESCE(ro.reloc_to, 30) AS destination_id',
              'bo.quantity AS quantity',
              'of.start_date AS start_date',
              'i.inventory_internal_code AS part_number',
              'i.inventory_name AS part_name_label',
              'of.remark AS remark',
              "'Ready' AS status",
              "COALESCE(sa.storage_code, 'N/A') AS racks_name",
            ])
            .from('batch_outbound', 'bo')
            .leftJoin('order_form', 'of', 'bo.order_form_id = of.id')
            .leftJoin('inventory', 'i', 'bo.inventory_id = i.id')
            .leftJoin('storage_area', 'sa', 'i.racks_id = sa.id')
            .leftJoin(
              'reloc_outbound',
              'ro',
              'ro.batch_in_id IN (SELECT bi.id FROM batch_inbound bi WHERE bi.inventory_id = bo.inventory_id)',
            )
            .where('bo.order_form_id = :orderId', { orderId: orderForm.id })
            .getRawMany();

          // Remove duplicates based on id and inventory_id combination
          const seen = new Set();
          sparepartList = rawSparepartList.filter((item) => {
            const key = `${item.id}-${item.inventory_id}`;
            if (seen.has(key)) {
              return false;
            }
            seen.add(key);
            return true;
          });
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
          // Check if order_type is "non sparepart"
          const isNonSparepart =
            createWorkOrderDto.order_type === ('non sparepart' as any);

          if (!isNonSparepart) {
            // 1. Check vehicle_id from vehicles table (only if not null or 0)
            if (
              createWorkOrderDto.vehicle_id &&
              createWorkOrderDto.vehicle_id !== 0
            ) {
              const vehicleExists = await manager
                .createQueryBuilder()
                .select('1')
                .from('vehicles', 'v')
                .where('v.id = :vehicleId', {
                  vehicleId: createWorkOrderDto.vehicle_id,
                })
                .getRawOne();

              if (!vehicleExists) {
                throwError(
                  'Vehicle ID not found in vehicles table',
                  400,
                );
              }
            }

            // 2. Check driver from users table
            const driverExists = await manager
              .createQueryBuilder()
              .select('1')
              .from('users', 'u')
              .where('u.id = :driverId', { driverId: createWorkOrderDto.driver })
              .getRawOne();

            if (!driverExists) {
              throwError('Driver ID not found in users table', 400);
            }

            // 3. Check mechanic from users table
            const mechanicExists = await manager
              .createQueryBuilder()
              .select('1')
              .from('users', 'u')
              .where('u.id = :mechanicId', {
                mechanicId: createWorkOrderDto.mechanic,
              })
              .getRawOne();

            if (!mechanicExists) {
              throwError(
                'Mechanic ID not found in users table',
                400,
              );
            }
          }

          // 5. Check inventory_id and quantity for each sparepart (for all order types)
          for (const sparepart of createWorkOrderDto.sparepart_list) {
            // Check inventory_id from inventory table
            const inventoryExists = await manager
              .createQueryBuilder()
              .select('i.id, i.quantity')
              .from('inventory', 'i')
              .where('i.id = :inventoryId', {
                inventoryId: sparepart.inventory_id,
              })
              .getRawOne();

            if (!inventoryExists) {
              throwError(
                `Inventory ID ${sparepart.inventory_id} not found in inventory table`,
                400,
              );
            }



            // 7. Check quantity from inventory table (only for sparepart orders)
            if (!isNonSparepart && sparepart.quantity > inventoryExists.quantity) {
              throwError(
                `Quantity ${sparepart.quantity} exceeds available quantity ${inventoryExists.quantity} for inventory ID ${sparepart.inventory_id}`,
                400,
              );
            }
          }

          // 4. Check request from users table (always required)
          const requestExists = await manager
            .createQueryBuilder()
            .select('1')
            .from('users', 'u')
            .where('u.id = :requestId', {
              requestId: createWorkOrderDto.request,
            })
            .getRawOne();

          if (!requestExists) {
            throwError('Request ID not found in users table', 400);
          }

          // 8. Create order form
          const orderForm = manager.create(OrderForm, {
            vehicle_id: createWorkOrderDto.vehicle_id || 0, // Set to 0 if null/undefined
            admin_id: userId,
            driver_id: createWorkOrderDto.driver,
            mechanic_id: createWorkOrderDto.mechanic,
            request_id: createWorkOrderDto.request,
            departement: createWorkOrderDto.departement,
            remark: createWorkOrderDto.remark,
            order_type: createWorkOrderDto.order_type,
            start_date: new Date(createWorkOrderDto.start_date),
            end_date: new Date(createWorkOrderDto.end_date),
            status: createWorkOrderDto.status,
            createdBy: userId,
          });

          console.log('Order form created:', orderForm);
          savedOrderForm = await manager.save(orderForm);
          console.log('Order form saved:', savedOrderForm);

          // 9. Create batch outbound for each sparepart (for all order types)
          for (const sparepart of createWorkOrderDto.sparepart_list) {
            console.log('Processing sparepart:', sparepart);

            const batchOutbound = manager.create(BatchOutbound, {
              inventory_id: sparepart.inventory_id,
              order_form_id: savedOrderForm.id, // Link to order_form
              quantity: sparepart.quantity,
              status: batchout_type.OUTBOUND,
              createdBy: userId,
            });

            console.log('Batch outbound created:', batchOutbound);
            const savedBatchOutbound = await manager.save(batchOutbound);
            console.log('Batch outbound saved:', savedBatchOutbound);

            // 10. Get batch_inbound data berdasarkan inventory_id
            console.log(
              'Searching for batch_inbound with inventory_id:',
              sparepart.inventory_id,
              'type:',
              typeof sparepart.inventory_id,
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
                inventoryId: sparepart.inventory_id,
              })
              .getRawMany();

            console.log(
              'Batch inbounds found for inventory_id',
              sparepart.inventory_id,
              ':',
              batchInbounds,
            );

            // 11. Get racks_id from inventory
            const inventory = await manager
              .createQueryBuilder()
              .select('i.racks_id')
              .from('inventory', 'i')
              .where('i.id = :id', { id: sparepart.inventory_id })
              .getOne();

            console.log('Inventory found:', inventory);

            // 12. Create reloc outbound untuk setiap batch_inbound
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
                  reloc_to: 0, // Set default value since destination_id is removed
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
              sparepart.inventory_id,
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
        throwError('Work order with this data already exists', 400);
      } else if (error.code === '23503') {
        // Foreign key constraint violation
        throwError(
          'Invalid reference data (vehicle, employee, or inventory not found)',
          400,
        );
      } else if (error.code === '22P02') {
        // Invalid text representation
        throwError('Invalid data format provided', 400);
      }

      if (error instanceof HttpException) throw error;
      throwError('Failed to create work order', 500);
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
          vehicle_id: updateWorkOrderDto.vehicle_id || orderForm!.vehicle_id,
          driver_id: updateWorkOrderDto.driver || orderForm!.driver_id,
          mechanic_id: updateWorkOrderDto.mechanic || orderForm!.mechanic_id,
          request_id: updateWorkOrderDto.request || orderForm!.request_id,
          order_type: updateWorkOrderDto.order_type || orderForm!.order_type,
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
              inventory_id: sparepart.inventory_id,
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
                inventoryId: sparepart.inventory_id,
              })
              .getMany();

            // Get racks_id from inventory
            const inventory = await manager
              .createQueryBuilder()
              .select('i.racks_id')
              .from('inventory', 'i')
              .where('i.id = :id', { id: sparepart.inventory_id })
              .getOne();

            // Create reloc outbound untuk setiap batch_inbound
            if (batchInbounds && batchInbounds.length > 0) {
              for (const batchInbound of batchInbounds) {
                const relocOutbound = manager.create(RelocOutbound, {
                  batch_in_id: batchInbound.id,
                  reloc_from: inventory?.racks_id || 0,
                  reloc_to: 0, // Set default value since destination_id is removed
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
      throwError('Failed to update work order', 500);
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
      throwError('Failed to delete work order', 500);
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
          approvalBy: userId,
          approvalAt: new Date(),
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
      } 
      
      if (approvalDto.status === ApprovalStatus.REJECTED) {
        // Jika reject, cek apakah picker_id sudah diassign
        if (orderForm!.picker_id && orderForm!.picker_id !== 0) {
          throwError(
            'Work order tidak dapat di-reject karena sudah di-assign picker',
            400,
          );
        }

        // Jika picker_id kosong, update status menjadi rejected dan kosongkan approval_at dan approval_by
        await this.orderFormRepository.update(id, {
          status: WorkOrderStatus.REJECTED,
          approvalBy: null,
          approvalAt: null,
        });

        return successResponse(
          {} as WorkOrderResponseDto,
          'Work order rejected successfully',
        );
      }
      
      throwError('Invalid approval status', 400);
    } catch (error) {
      console.error('Approval error:', error);
      if (error instanceof HttpException) throw error;
      throwError('Failed to process approval', 500);
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

      // Validasi picker_id exists di tabel users
      const userExists = await this.dataSource
        .createQueryBuilder()
        .select('1')
        .from('users', 'u')
        .where('u.id = :pickerId', { pickerId: assignPickerDto.picker_id })
        .getRawOne();

      if (!userExists) {
        throwError('Picker ID tidak ditemukan di tabel users', 400);
      }

      // Update picker_id di tabel order_form
      await this.orderFormRepository.update(
        { id },
        {
          picker_id: assignPickerDto.picker_id,
          updatedBy: userId,
          updatedAt: new Date(),
        },
      );

      return successResponse(
        {} as WorkOrderResponseDto,
        'Picker assigned successfully',
      );
    } catch (error) {
      console.error('Assign picker error:', error);
      if (error instanceof HttpException) throw error;
      throwError('Failed to assign picker', 500);
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
