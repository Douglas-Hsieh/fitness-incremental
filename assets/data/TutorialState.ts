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
    message: 'Exercise is easy! Touch your puppy to make it run 1 step.',
    isCompleted: false,
  },
  firstGenerator2: {
    message: 'Your puppy has produced enough steps for you to recruit another puppy!',
    isCompleted: false,
  },
  firstGenerator3: {
    message: 'Two puppies produce more steps than one!',
    isCompleted: false,
  },
  ticks1: {
    message: "Your followers use motivation in order to move.",
    isCompleted: false,
  },
  ticks2: {
    message: 'You earn motivation for your followers whenever you move in real life!',
    isCompleted: false,
  },
  secondGenerator: {
    message: "Your friends run longer and faster than puppies. Let's buy some friendship.",
    isCompleted: false,
  },
  manager1: {
    message: "You now have enough to purchase an upgrade!",
    isCompleted: false,
  },
  manager2: {
    message: "Click on the third icon!",
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