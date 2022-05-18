export class StepProgress {
  time: Date;
  steps: number;  // Steps since last progress
  isForeground: boolean;

  constructor(time = new Date(), steps = 0, isForeground = false) {
    this.time = time
    this.steps = steps
    this.isForeground = isForeground
  }

  static fromJson = (stepProgress: StepProgress) => {
    return new StepProgress(
      new Date(stepProgress.time),
      stepProgress.steps,
      stepProgress.isForeground,
    )
  }
}