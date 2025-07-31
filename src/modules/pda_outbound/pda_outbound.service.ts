import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderForm } from '../work_order/entities/order_form.entity';
import { PdaOutboundResponseDto } from './dto/response.dto';

@Injectable()
export class PdaOutboundService {
  constructor(
    @InjectRepository(OrderForm)
    private orderFormRepository: Repository<OrderForm>,
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
} 