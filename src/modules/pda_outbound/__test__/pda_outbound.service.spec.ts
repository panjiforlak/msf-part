import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { PdaOutboundService } from '../pda_outbound.service';
import { OrderForm } from '../../work_order/entities/order_form.entity';
import { BatchOutbound } from '../../work_order/entities/batch_outbound.entity';
import { BatchInbound } from '../../batch_in/entities/batchin.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';
import { RelocInbound } from '../../relocation/entities/relocin.entity';

describe('PdaOutboundService', () => {
  let service: PdaOutboundService;
  let orderFormRepository: Repository<OrderForm>;
  let batchOutboundRepository: Repository<BatchOutbound>;
  let batchInboundRepository: Repository<BatchInbound>;
  let inventoryRepository: Repository<Inventory>;
  let relocInboundRepository: Repository<RelocInbound>;

  const mockOrderFormRepository = {
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
  };

  const mockBatchOutboundRepository = {
    createQueryBuilder: jest.fn(() => ({
      leftJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
    })),
  };

  const mockBatchInboundRepository = {
    findOne: jest.fn(),
  };

  const mockInventoryRepository = {
    findOne: jest.fn(),
  };

  const mockRelocInboundRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PdaOutboundService,
        {
          provide: getRepositoryToken(OrderForm),
          useValue: mockOrderFormRepository,
        },
        {
          provide: getRepositoryToken(BatchOutbound),
          useValue: mockBatchOutboundRepository,
        },
        {
          provide: getRepositoryToken(BatchInbound),
          useValue: mockBatchInboundRepository,
        },
        {
          provide: getRepositoryToken(Inventory),
          useValue: mockInventoryRepository,
        },
        {
          provide: getRepositoryToken(RelocInbound),
          useValue: mockRelocInboundRepository,
        },
      ],
    }).compile();

    service = module.get<PdaOutboundService>(PdaOutboundService);
    orderFormRepository = module.get<Repository<OrderForm>>(getRepositoryToken(OrderForm));
    batchOutboundRepository = module.get<Repository<BatchOutbound>>(getRepositoryToken(BatchOutbound));
    batchInboundRepository = module.get<Repository<BatchInbound>>(getRepositoryToken(BatchInbound));
    inventoryRepository = module.get<Repository<Inventory>>(getRepositoryToken(Inventory));
    relocInboundRepository = module.get<Repository<RelocInbound>>(getRepositoryToken(RelocInbound));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return data filtered by picker_id when superadmin is not "yes"', async () => {
      const mockData = [
        {
          id: 1,
          picker_id: 123,
          vehicle_id: 1,
          admin_id: 1,
          driver_id: 1,
          mechanic_id: 1,
          request_id: 1,
          departement: 'IT',
          remark: 'Test remark',
          order_type: 'sparepart',
          start_date: new Date(),
          end_date: new Date(),
          status: 'pending',
          createdBy: 1,
          createdAt: new Date(),
          updatedBy: 1,
          updatedAt: new Date(),
          deletedBy: 0,
          deletedAt: null,
          approvalBy: null,
          approvalAt: null,
        },
      ];

      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockData),
      };

      mockOrderFormRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.findAll(123, 'no');

      expect(queryBuilder.where).toHaveBeenCalledWith('order_form.picker_id = :userId', { userId: 123 });
      expect(result).toEqual([
        {
          ...mockData[0],
          label_wo: 'WO-1',
        },
      ]);
    });

    it('should return all data when superadmin is "yes"', async () => {
      const mockData = [
        {
          id: 1,
          picker_id: 123,
          vehicle_id: 1,
          admin_id: 1,
          driver_id: 1,
          mechanic_id: 1,
          request_id: 1,
          departement: 'IT',
          remark: 'Test remark',
          order_type: 'sparepart',
          start_date: new Date(),
          end_date: new Date(),
          status: 'pending',
          createdBy: 1,
          createdAt: new Date(),
          updatedBy: 1,
          updatedAt: new Date(),
          deletedBy: 0,
          deletedAt: null,
          approvalBy: null,
          approvalAt: null,
        },
        {
          id: 2,
          picker_id: 456,
          vehicle_id: 2,
          admin_id: 1,
          driver_id: 1,
          mechanic_id: 1,
          request_id: 1,
          departement: 'IT',
          remark: 'Test remark 2',
          order_type: 'sparepart',
          start_date: new Date(),
          end_date: new Date(),
          status: 'pending',
          createdBy: 1,
          createdAt: new Date(),
          updatedBy: 1,
          updatedAt: new Date(),
          deletedBy: 0,
          deletedAt: null,
          approvalBy: null,
          approvalAt: null,
        },
      ];

      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockData),
      };

      mockOrderFormRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.findAll(123, 'yes');

      expect(queryBuilder.where).not.toHaveBeenCalled();
      expect(result).toEqual([
        {
          ...mockData[0],
          label_wo: 'WO-1',
        },
        {
          ...mockData[1],
          label_wo: 'WO-2',
        },
      ]);
    });

    it('should return batch outbound data by order form id', async () => {
      const mockData = [
        {
          id: 1,
          inventory_id: 1,
          destination_id: 30,
          quantity: 1,
          start_date: new Date(),
          part_number: 'INT/I1HGBH41JXMN192',
          part_name_label: 'Fuel Pump',
          remark: 'testing',
          status: 'outbound',
          racks_name: 'R4',
        },
      ];

      const queryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(mockData),
      };

      mockBatchOutboundRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.findBatchOutboundByOrderFormId(10);

      expect(queryBuilder.where).toHaveBeenCalledWith('bo.order_form_id = :orderFormId', { orderFormId: 10 });
      expect(result).toEqual([
        {
          ...mockData[0],
          label_wo: 'WO-10',
        },
      ]);
    });

    describe('createRelocation', () => {
      it('should create relocation successfully', async () => {
        const createRelocationDto = {
          barcode_inbound: 'abc123def456',
          quantity: 5,
        };

        const mockBatchInbound = {
          id: 1,
          barcode: 'abc123def456',
          inventory_id: 10,
        };

        const mockInventory = {
          id: 10,
          racks_id: 5,
        };

        const mockRelocation = {
          id: 1,
          batch_in_id: 1,
          reloc_from: 5,
          reloc_to: 0,
          reloc_type: 'outbound',
          quantity: 5,
          picker_id: 123,
          reloc_status: false,
          reloc_date: new Date(),
          createdBy: 123,
        };

        mockBatchInboundRepository.findOne.mockResolvedValue(mockBatchInbound);
        mockInventoryRepository.findOne.mockResolvedValue(mockInventory);
        mockRelocInboundRepository.create.mockReturnValue(mockRelocation);
        mockRelocInboundRepository.save.mockResolvedValue(mockRelocation);

        const result = await service.createRelocation(createRelocationDto, 123);

        expect(mockBatchInboundRepository.findOne).toHaveBeenCalledWith({
          where: { barcode: 'abc123def456' },
        });
        expect(mockInventoryRepository.findOne).toHaveBeenCalledWith({
          where: { id: 10 },
        });
        expect(mockRelocInboundRepository.create).toHaveBeenCalledWith({
          batch_in_id: 1,
          reloc_from: 5,
          reloc_to: 0,
          reloc_type: 'outbound',
          quantity: 5,
          picker_id: 123,
          reloc_status: false,
          reloc_date: expect.any(Date),
          createdBy: 123,
        });
        expect(result).toEqual({
          id: 1,
          batch_in_id: 1,
          reloc_from: 5,
          reloc_to: 0,
          reloc_type: 'outbound',
          quantity: 5,
          picker_id: 123,
          reloc_status: false,
          reloc_date: expect.any(Date),
          barcode_inbound: 'abc123def456',
        });
      });

      it('should throw error when barcode inbound not found', async () => {
        const createRelocationDto = {
          barcode_inbound: 'invalid_barcode',
          quantity: 5,
        };

        mockBatchInboundRepository.findOne.mockResolvedValue(null);

        await expect(service.createRelocation(createRelocationDto, 123)).rejects.toThrow(
          HttpException,
        );
        await expect(service.createRelocation(createRelocationDto, 123)).rejects.toThrow(
          'Barcode inbound \'invalid_barcode\' tidak ditemukan',
        );
      });

      it('should throw error when inventory not found', async () => {
        const createRelocationDto = {
          barcode_inbound: 'abc123def456',
          quantity: 5,
        };

        const mockBatchInbound = {
          id: 1,
          barcode: 'abc123def456',
          inventory_id: 10,
        };

        mockBatchInboundRepository.findOne.mockResolvedValue(mockBatchInbound);
        mockInventoryRepository.findOne.mockResolvedValue(null);

        await expect(service.createRelocation(createRelocationDto, 123)).rejects.toThrow(
          HttpException,
        );
        await expect(service.createRelocation(createRelocationDto, 123)).rejects.toThrow(
          'Inventory dengan ID 10 tidak ditemukan',
        );
      });
    });
  });
}); 