export class Visit {
  time: Date;
  steps: number;  // Steps since last visit

  constructor(time = new Date(), steps = 0) {
    this.time = time
    this.steps = steps
  }

  static fromJson = (visit: Visit) => {
    return new Visit(new Date(visit.time), visit.steps)
  }
}