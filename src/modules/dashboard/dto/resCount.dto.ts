export class ResponseCountDto {
  id: number;
  total_inventory?: number;
  total_stock_in: number;
  total_stock_out: number;
  total_completed_wo: number;
  total_completed_fo: number;
  total_rack: number;
}
