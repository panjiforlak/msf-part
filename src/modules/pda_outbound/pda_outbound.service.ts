import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderForm } from '../work_order/entities/order_form.entity';
import { BatchOutbound } from '../work_order/entities/batch_outbound.entity';
import { BatchInbound } from '../batch_in/entities/batchin.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { RelocInbound } from '../relocation/entities/relocin.entity';
import { PdaOutboundResponseDto } from './dto/response.dto';
import { BatchOutboundResponseDto } from './dto/batch-outbound-response.dto';
import { CreateRelocationDto } from './dto/create-relocation.dto';

@Injectable()
export class PdaOutboundService {
  constructor(
    @InjectRepository(OrderForm)
    private orderFormRepository: Repository<OrderForm>,
    @InjectRepository(BatchOutbound)
    private batchOutboundRepository: Repository<BatchOutbound>,
    @InjectRepository(BatchInbound)
    private batchInboundRepository: Repository<BatchInbound>,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(RelocInbound)
    private relocInboundRepository: Repository<RelocInbound>,
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

  async createRelocation(createRelocationDto: CreateRelocationDto, userId: number): Promise<any> {
    // 1. Cek barcode_inbound ada di tabel batch_inbound atau tidak
    const batchInbound = await this.batchInboundRepository.findOne({
      where: { barcode: createRelocationDto.barcode_inbound },
    });

    if (!batchInbound) {
      throw new HttpException(
        `Barcode inbound '${createRelocationDto.barcode_inbound}' tidak ditemukan`,
        HttpStatus.NOT_FOUND,
      );
    }

    // 2. Ambil inventory_id dari batch_inbound
    const inventoryId = batchInbound.inventory_id;

    // 3. Cek di tabel inventory dan ambil racks_id
    const inventory = await this.inventoryRepository.findOne({
      where: { id: inventoryId },
    });

    if (!inventory) {
      throw new HttpException(
        `Inventory dengan ID ${inventoryId} tidak ditemukan`,
        HttpStatus.NOT_FOUND,
      );
    }

    const racksId = inventory.racks_id;

    // 4. Buat data relocation
    const relocation = this.relocInboundRepository.create({
      batch_in_id: batchInbound.id, // id dari tabel batch_inbound
      reloc_from: racksId, // racks_id dari tabel inventory
      reloc_to: 0, // dikosongkan
      reloc_type: 'outbound', // diisi dengan "outbound"
      quantity: createRelocationDto.quantity, // quantity dari body request
      picker_id: userId, // user_id dari bearer token
      reloc_status: false, // false saja
      reloc_date: new Date(), // waktu saat ini
      createdBy: userId,
    });

    const savedRelocation = await this.relocInboundRepository.save(relocation);

    return {
      id: savedRelocation.id,
      batch_in_id: savedRelocation.batch_in_id,
      reloc_from: savedRelocation.reloc_from,
      reloc_to: savedRelocation.reloc_to,
      reloc_type: savedRelocation.reloc_type,
      quantity: savedRelocation.quantity,
      picker_id: savedRelocation.picker_id,
      reloc_status: savedRelocation.reloc_status,
      reloc_date: savedRelocation.reloc_date,
      barcode_inbound: createRelocationDto.barcode_inbound,
    };
  }
} 