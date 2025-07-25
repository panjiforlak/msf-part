export class ResponseDto {
  id: number;
  uuid?: string;
  inventory_id: number;
  doc_ship_id: number;
  supplier_id: number;
  quantity: number;
  price: number;
  arrival_date: string;
  status_reloc: string;
  picker_id: number;
  createdBy: number;
  createdAt: Date;
  updatedBy: number;
  updatedAt: Date | null;
  deletedBy: number;
  deletedAt: Date | null;
}
