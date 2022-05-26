import { Image, Text } from "react-native";
import { StepsImage, TicksImage } from "../../src/components/TopBar";
import { styles } from "../../src/screens/UpgradesScreen";
import { Generator1Image, Generator2Image, GENERATORS_BY_ID } from "./Generators";

type TutorialMessage = string | JSX.Element

export interface Tutorial {
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

export const TUTORIAL: Tutorial = {
  firstGenerator1:
    <Text>
      Exercising is easy!
      Touch your puppy <Generator1Image/> to make it run
    </Text>,
  firstGenerator2:
    <Text>
      You have enough steps <StepsImage/> to recruit another puppy <Generator1Image/>
    </Text>,
  firstGenerator3:
    <Text>
      Two puppies <Generator1Image/> produce more steps <StepsImage/> than one!
    </Text>,
  ticks1: <Text>Your followers <Generator1Image/> <Generator2Image/> use motivation <TicksImage/> in order to move.</Text>,
  ticks2: <Text>You earn motivation <TicksImage/> when you move in real life!</Text>,
  secondGenerator: <Text>Friends <Generator2Image/> run faster than puppies <Generator1Image/>. Let's buy a friend <Generator2Image/></Text>,
  manager1: <Text>You have enough steps <StepsImage/> to purchase an upgrade!</Text>,
  manager2: "Click on the third icon!",
  manager3: "Walking puppies by yourself is tiring! Let's hire a puppy walker!",
  prestige: "You've got some trainers applying to join your team!",
}

const style = {
  icon: {
    marginLeft: 10,
    width: 25,
    height: 25,
  }
}