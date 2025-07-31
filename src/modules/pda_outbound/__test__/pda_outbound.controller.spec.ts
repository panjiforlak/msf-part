import { Test, TestingModule } from '@nestjs/testing';
import { PdaOutboundController } from '../pda_outbound.controller';
import { PdaOutboundService } from '../pda_outbound.service';

describe('PdaOutboundController', () => {
  let controller: PdaOutboundController;
  let service: PdaOutboundService;

  const mockService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PdaOutboundController],
      providers: [
        {
          provide: PdaOutboundService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PdaOutboundController>(PdaOutboundController);
    service = module.get<PdaOutboundService>(PdaOutboundService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return data with success response', async () => {
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
          label_wo: 'WO-1',
        },
      ];

      const mockRequest = {
        user: {
          id: 123,
        },
      };

      const mockQuery = {
        superadmin: 'no',
      };

      mockService.findAll.mockResolvedValue(mockData);

      const result = await controller.findAll(mockRequest, mockQuery);

      expect(service.findAll).toHaveBeenCalledWith(123, 'no');
      expect(result).toEqual({
        statusCode: 200,
        message: 'Data PDA Outbound berhasil diambil',
        data: mockData,
      });
    });
  });
}); 