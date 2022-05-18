export interface LastVisitStats {
  steps: number;
  ticks: number;
  revenue: number;
  ticksUsed: number;
}

export const DEFAULT_LAST_VISIT_STATS: LastVisitStats = {
  steps: 0,
  ticks: 0,
  revenue: 0,
  ticksUsed: 0,
}