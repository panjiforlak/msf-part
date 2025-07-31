import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderForm } from '../work_order/entities/order_form.entity';
import { BatchOutbound } from '../work_order/entities/batch_outbound.entity';
import { BatchInbound } from '../batch_in/entities/batchin.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { RelocInbound } from '../relocation/entities/relocin.entity';
import { Vehicles } from '../master/vehicles/entities/vehicle.entity';
import { Users } from '../users/entities/users.entity';
import { Sppb } from './entities/sppb.entity';
import { InboundOutboundArea } from '../master/inoutarea/entities/inout.entity';
import { PdaOutboundResponseDto } from './dto/response.dto';
import { BatchOutboundResponseDto } from './dto/batch-outbound-response.dto';
import { CreateRelocationDto } from './dto/create-relocation.dto';
import { ScanDestinationDto } from './dto/scan-destination.dto';
import {
  GetAreaOutboundDto,
  GetAreaOutboundResponseDto,
} from './dto/get-area-outbound.dto';

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
    @InjectRepository(Vehicles)
    private vehiclesRepository: Repository<Vehicles>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Sppb)
    private sppbRepository: Repository<Sppb>,
    @InjectRepository(InboundOutboundArea)
    private inboundOutboundAreaRepository: Repository<InboundOutboundArea>,
  ) {}

  async findAll(
    userId: number,
    superadmin?: string,
  ): Promise<PdaOutboundResponseDto[]> {
    let query = this.orderFormRepository.createQueryBuilder('order_form');

    // Jika superadmin = 'yes', tampilkan semua data
    // Jika tidak, tampilkan data sesuai dengan picker_id yang sesuai dengan user id
    if (superadmin !== 'yes') {
      query = query.where('order_form.picker_id = :userId', { userId });
    }

    const orderForms = await query
      .leftJoin('vehicles', 'v', 'order_form.vehicle_id = v.id')
      .leftJoin('users', 'admin_user', 'order_form.admin_id = admin_user.id')
      .leftJoin('users', 'driver_user', 'order_form.driver_id = driver_user.id')
      .leftJoin(
        'users',
        'mechanic_user',
        'order_form.mechanic_id = mechanic_user.id',
      )
      .leftJoin(
        'users',
        'request_user',
        'order_form.request_id = request_user.id',
      )
      .leftJoin(
        'users',
        'approval_user',
        'order_form.approval_by = approval_user.id',
      )
      .leftJoin('users', 'picker_user', 'order_form.picker_id = picker_user.id')
      .select([
        'order_form.*',
        'v.vin_number as vin_number',
        'admin_user.name as admin_name',
        'driver_user.name as driver_name',
        'mechanic_user.name as mechanic_name',
        'request_user.name as request_name',
        'approval_user.name as approvalBy_name',
        'picker_user.name as picker_name',
      ])
      .orderBy('order_form.createdAt', 'DESC')
      .getRawMany();

    // Transform data dan tambahkan label_wo
    return orderForms.map((orderForm) => ({
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
        'bo.id AS batch_outbound_id',
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

  async scanDestination(scanDestinationDto: ScanDestinationDto, userId: number): Promise<any> {
    // 1. Cek barcode_inbound ada di tabel batch_inbound atau tidak
    const batchInbound = await this.batchInboundRepository.findOne({
      where: { barcode: scanDestinationDto.barcode_inbound },
    });

    if (!batchInbound) {
      throw new HttpException(
        `Barcode inbound '${scanDestinationDto.barcode_inbound}' tidak ditemukan`,
        HttpStatus.NOT_FOUND,
      );
    }

    // 2. Cek batch_outbound_id ada atau tidak
    const batchOutbound = await this.batchOutboundRepository.findOne({
      where: { id: scanDestinationDto.batch_outbound_id },
    });

    if (!batchOutbound) {
      throw new HttpException(
        `Batch outbound dengan ID ${scanDestinationDto.batch_outbound_id} tidak ditemukan`,
        HttpStatus.NOT_FOUND,
      );
    }

    // 3. Ambil inventory_id dari batch_inbound
    const inventoryId = batchInbound.inventory_id;

    // 4. Cek di tabel inventory dan ambil racks_id
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

    // 5. Buat data relocation
    const relocation = this.relocInboundRepository.create({
      batch_in_id: batchInbound.id,
      reloc_from: racksId,
      reloc_to: 0,
      reloc_type: 'outbound',
      quantity: scanDestinationDto.quantity,
      picker_id: userId,
      reloc_status: false,
      reloc_date: new Date(),
      createdBy: userId,
    });

    const savedRelocation = await this.relocInboundRepository.save(relocation);

    // 6. Hitung total quantity yang sudah di-scan untuk batch_outbound_id ini
    const totalScannedQuantity = await this.relocInboundRepository
      .createQueryBuilder('reloc')
      .leftJoin('batch_inbound', 'bi', 'reloc.batch_in_id = bi.id')
      .where('bi.inventory_id = :inventoryId', { inventoryId })
      .andWhere('reloc.reloc_type = :relocType', { relocType: 'outbound' })
      .andWhere('reloc.picker_id = :pickerId', { pickerId: userId })
      .andWhere('reloc.createdAt >= :today', { today: new Date().setHours(0, 0, 0, 0) })
      .select('SUM(reloc.quantity)', 'total')
      .getRawOne();

    const totalQuantity = parseInt(totalScannedQuantity?.total || '0');
    const targetQuantity = batchOutbound.quantity;
    const isCompleted = totalQuantity >= targetQuantity;

    let sppbId: number | null = null;
    let sppbNumber: string | null = null;

    // 7. Jika sudah mencapai target quantity, buat data SPPB
    if (isCompleted) {
      // Ambil order_form_id dari batch_outbound
      const orderFormId = batchOutbound.order_form_id || 0;

      // Generate sppb_number
      const lastSppb = await this.sppbRepository
        .createQueryBuilder('sppb')
        .orderBy('sppb.id', 'DESC')
        .getOne();

      let nextNumber = 1;
      if (lastSppb) {
        const lastNumber = parseInt(lastSppb.sppb_number.replace('WHO', ''));
        nextNumber = lastNumber + 1;
      }

      const sppbNumberStr = `WHO${nextNumber.toString().padStart(3, '0')}`;

      // Buat data SPPB
      const sppb = this.sppbRepository.create({
        order_form_id: orderFormId,
        sppb_number: sppbNumberStr,
        mechanic_photo: null,
        status: 'waiting',
        createdBy: userId,
      });

      const savedSppb = await this.sppbRepository.save(sppb);
      sppbId = savedSppb.id;
      sppbNumber = savedSppb.sppb_number;
    }

    return {
      id: savedRelocation.id,
      barcode_inbound: scanDestinationDto.barcode_inbound,
      quantity: scanDestinationDto.quantity,
      total_scanned_quantity: totalQuantity,
      target_quantity: targetQuantity,
      is_completed: isCompleted,
      sppb_id: sppbId,
      sppb_number: sppbNumber,
    };
  }

  async getAreaOutbound(
    getAreaOutboundDto: GetAreaOutboundDto,
  ): Promise<GetAreaOutboundResponseDto[]> {
    // 1. Cek barcode_area apakah ada di tabel inbound_outbound_area di kolom barcode
    const areaExists = await this.inboundOutboundAreaRepository.findOne({
      where: { barcode: getAreaOutboundDto.barcode_area },
    });

    if (!areaExists) {
      throw new HttpException(
        `Barcode area '${getAreaOutboundDto.barcode_area}' tidak ditemukan di tabel inbound_outbound_area`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // 2. Ambil data yang sesuai dengan barcode_area yang dikirimkan
    const area = await this.inboundOutboundAreaRepository.findOne({
      where: { barcode: getAreaOutboundDto.barcode_area },
      order: {
        id: 'ASC',
      },
    });

    return area ? [area] : [];
  }
} 