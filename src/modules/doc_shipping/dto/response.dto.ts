export class ResponseDto {
  id: number;
  uuid?: string;
  doc_ship_no: string;
  doc_ship_photo: string;
  arrival_date?: string;
  createdBy: number;
  createdAt: Date;
  updatedBy: number;
  updatedAt: Date | null;
  deletedBy: number;
  deletedAt: Date | null;
}
