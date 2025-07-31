import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderForm } from '../work_order/entities/order_form.entity';
import { BatchOutbound } from '../work_order/entities/batch_outbound.entity';
import { PdaOutboundResponseDto } from './dto/response.dto';
import { BatchOutboundResponseDto } from './dto/batch-outbound-response.dto';

@Injectable()
export class PdaOutboundService {
  constructor(
    @InjectRepository(OrderForm)
    private orderFormRepository: Repository<OrderForm>,
    @InjectRepository(BatchOutbound)
    private batchOutboundRepository: Repository<BatchOutbound>,
  ) {}

  async findAll(userId: number, superadmin?: string): Promise<PdaOutboundResponseDto[]> {
    let query = this.orderFormRepository.createQueryBuilder('order_form');

    // Jika superadmin = 'yes', tampilkan semua data
    // Jika tidak, tampilkan data sesuai dengan picker_id yang sesuai dengan user id
    if (superadmin !== 'yes') {
      query = query.where('order_form.picker_id = :userId', { userId });
    }

    const orderForms = await query
      .orderBy('order_form.createdAt', 'DESC')
      .getMany();

    // Transform data dan tambahkan label_wo
    return orderForms.map(orderForm => ({
      ...orderForm,
      label_wo: `WO-${orderForm.id}`,
    }));
  }

  async findBatchOutboundByOrderFormId(orderFormId: number): Promise<BatchOutboundResponseDto[]> {
    const batchOutbounds = await this.batchOutboundRepository
      .createQueryBuilder('bo')
      .leftJoin('inventory', 'i', 'bo.inventory_id = i.id')
      .leftJoin('components', 'c', 'i.component_id = c.id')
      .leftJoin('storage_area', 'sa', 'i.racks_id = sa.id')
      .leftJoin('order_form', 'of', 'bo.order_form_id = of.id')
      .select([
        'bo.id AS id',
        'bo.inventory_id AS inventory_id',
        'of.driver_id AS destination_id',
        'bo.quantity AS quantity',
        'of.start_date AS start_date',
        'i.inventory_code AS part_number',
        'c.component_name AS part_name_label',
        'bo.remarks AS remark',
        'bo.status AS status',
        'sa.storage_code AS racks_name',
      ])
      .where('bo.order_form_id = :orderFormId', { orderFormId })
      .andWhere('bo."deletedAt" IS NULL')
      .orderBy('bo.id', 'DESC')
      .getRawMany();

    // Transform data dan tambahkan label_wo
    return batchOutbounds.map(batchOutbound => ({
      ...batchOutbound,
      label_wo: `WO-${orderFormId}`,
    }));
  }
} 