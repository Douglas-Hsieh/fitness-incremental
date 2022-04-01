import { List } from "immutable"

export const APP_NAME = 'Fitness Tycoon'
export const TICKS_PER_STEP = 15
export const STEPS_REQUIRED_FOR_REWARD = 6000
export interface TickLevel {
  ticksToUse: number;
  threshold: number;
  progressBarClassnames: string;
}
export const TICK_LEVELS: List<TickLevel> = List([
  { ticksToUse: 0, threshold: 0, progressBarClassnames: 'bg-red-500'},
  { ticksToUse: 1, threshold: 2 * 86400, progressBarClassnames: 'bg-gray-300' },
  { ticksToUse: 2, threshold: 6 * 86400, progressBarClassnames: 'bg-green-400' },
  { ticksToUse: 3, threshold: 12 * 86400, progressBarClassnames: 'bg-blue-400' },
  { ticksToUse: 4, threshold: Infinity, progressBarClassnames: 'bg-purple-400' },
])

export const TICK_THRESHOLDS = TICK_LEVELS.map(t => t.threshold)
export const TICKS_TO_USE = TICK_LEVELS.map(t => t.ticksToUse)
export const PROGRESS_BAR_CLASSNAMES = TICK_LEVELS.map(t => t.progressBarClassnames)