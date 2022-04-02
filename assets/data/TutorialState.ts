export interface TutorialMessage {
  message: string;
  isCompleted: boolean;
}

export interface TutorialState {
  firstGenerator1: TutorialMessage,
  firstGenerator2: TutorialMessage,
  firstGenerator3: TutorialMessage,
  ticks1: TutorialMessage,
  ticks2: TutorialMessage,
  secondGenerator: TutorialMessage,
  manager1: TutorialMessage,
  manager2: TutorialMessage,
  manager3: TutorialMessage,
  prestige: TutorialMessage,
}

export const INITIAL_TUTORIAL_STATE: TutorialState = {
  firstGenerator1: {
    message: 'Exercise is easy! Touch the puppy to make it walk.',
    isCompleted: false,
  },
  firstGenerator2: {
    message: 'You can now afford to buy another puppy!',
    isCompleted: false,
  },
  firstGenerator3: {
    message: 'Two puppers are better than one.',
    isCompleted: false,
  },
  ticks1: {
    message: "This is your energy. Your followers need energy to move.",
    isCompleted: false,
  },
  ticks2: {
    message: 'You earn energy by moving around the world.',
    isCompleted: false,
  },
  secondGenerator: {
    message: "Your friends run faster than puppies. Now you get to buy one.",
    isCompleted: false,
  },
  manager1: {
    message: "You now have enough to purchase an upgrade!",
    isCompleted: false,
  },
  manager2: {
    message: "Click here!",
    isCompleted: false,
  },
  manager3: {
    message: "Walking puppies by yourself is tiring! Let's hire a puppy walker!",
    isCompleted: false,
  },
  prestige: {
    message: "Hey boss! You've got some trainers applying to join your team!",
    isCompleted: false,
  },
}