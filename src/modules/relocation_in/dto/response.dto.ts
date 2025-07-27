export class ResponseDto {
  id: number;
  uuid?: string;
  batch_in_id: number;
  reloc_from: number;
  reloc_to: number;
  quantity: number;
  reloc_date: Date;
  createdBy: number;
  createdAt: Date;
  updatedBy: number;
  updatedAt: Date | null;
  deletedBy: number;
  deletedAt: Date | null;
}
