import { List } from "immutable"
import { HighlightOptions } from "react-native-highlight-overlay/lib/typescript/context/context";

export const APP_NAME = 'Fitness Tycoon'

// Google OAuth Client Ids
// export const GOOGLE_CLIENT_ID = '449996184337-rrfs2359a4f17i3kcdld35t3fntijl83.apps.googleusercontent.com'
export const WEB_CLIENT_ID = '449996184337-h3nmg0vln8jeh8u40o2p7bbm4r1oamds.apps.googleusercontent.com'
export const IOS_CLIENT_ID = '449996184337-q63keadmcksi0b4d15j1kb1grd1e83g7.apps.googleusercontent.com'

export const TICKS_PER_STEP = 15
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


export interface StepReward {
  steps: number
  rewards: number
}
export const STEP_REWARDS: List<StepReward> = List([
  { steps: 0, rewards: 0 },
  { steps: 5000, rewards: 1 },
  { steps: 7500, rewards: 2 },
  { steps: 10000, rewards: 3 },
  { steps: 12500, rewards: 4 },
  { steps: 15000, rewards: 5 },
])

export const HIGHLIGHTABLE_RECTANGLE_OPTIONS: HighlightOptions = {
  mode: 'rectangle',
  borderRadius: 10,
}