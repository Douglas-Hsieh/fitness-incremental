import React, { useState } from "react";

interface AppContextInterface {
  upgradeIconHasBadge: boolean;
  setUpgradeIconHasBadge: React.Dispatch<React.SetStateAction<boolean>>
  taskIconHasBadge: boolean;
  setTaskIconHasBadge: React.Dispatch<React.SetStateAction<boolean>>
}

export const AppContext = React.createContext<AppContextInterface | null>(null)

const AppContextProvider: React.FC = ({children}) => {
  const [upgradeIconHasBadge, setUpgradeIconHasBadge] = useState<boolean>(false)
  const [taskIconHasBadge, setTaskIconHasBadge] = useState<boolean>(false)

  return (
    <AppContext.Provider value={{upgradeIconHasBadge, setUpgradeIconHasBadge, taskIconHasBadge, setTaskIconHasBadge}}>
      { children }
    </AppContext.Provider>
  )
}

export default AppContextProvider