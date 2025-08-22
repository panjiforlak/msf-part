import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'v_dashboard_count' })
export class DashboardCount {
  @ViewColumn()
  total_inventory: number;

  @ViewColumn()
  total_stock_in: number;

  @ViewColumn()
  total_stock_out: number;

  @ViewColumn()
  total_completed_wo: number;

  @ViewColumn()
  total_completed_fo: number;

  @ViewColumn()
  total_rack: number;
}
