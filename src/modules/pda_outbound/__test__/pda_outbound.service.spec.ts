import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PdaOutboundService } from '../pda_outbound.service';
import { OrderForm } from '../../work_order/entities/order_form.entity';

describe('PdaOutboundService', () => {
  let service: PdaOutboundService;
  let repository: Repository<OrderForm>;

  const mockRepository = {
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PdaOutboundService,
        {
          provide: getRepositoryToken(OrderForm),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PdaOutboundService>(PdaOutboundService);
    repository = module.get<Repository<OrderForm>>(getRepositoryToken(OrderForm));
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

      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);

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

      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);

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
  });
}); 