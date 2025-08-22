import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'v_dashboard_tren_daily' })
export class DashboardTrendDaily {
  @ViewColumn()
  inventory_name: string;

  @ViewColumn()
  dmy: Date; // pakai Date karena hasil DATE_TRUNC('day')

  @ViewColumn()
  total_cost: number;
}

@ViewEntity({ name: 'v_dashboard_tren_monthly' })
export class DashboardTrendMonthly {
  @ViewColumn()
  inventory_name: string;

  @ViewColumn()
  dmy: string; // hasil TO_CHAR -> string YYYY-MM

  @ViewColumn()
  total_cost: number;
}

@ViewEntity({ name: 'v_dashboard_tren_annualy' })
export class DashboardTrendAnnualy {
  @ViewColumn()
  inventory_name: string;

  @ViewColumn()
  dmy: number; // hasil EXTRACT(YEAR) -> int

  @ViewColumn()
  total_cost: number;
}
