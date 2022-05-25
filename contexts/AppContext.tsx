import React, { useState } from "react";

interface AppContextInterface {
  taskIconHasBadge: boolean;
  setTaskIconHasBadge: React.Dispatch<React.SetStateAction<boolean>>;
  cashUpgradeHasBadge: boolean;
  setCashUpgradeHasBadge: React.Dispatch<React.SetStateAction<boolean>>;
  prestigeUpgradeHasBadge: boolean;
  setPrestigeUpgradeHasBadge: React.Dispatch<React.SetStateAction<boolean>>;
  managerUpgradeHasBadge: boolean;
  setManagerUpgradeHasBadge: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = React.createContext<AppContextInterface | null>(null)

const AppContextProvider: React.FC = ({children}) => {
  const [taskIconHasBadge, setTaskIconHasBadge] = useState<boolean>(false)
  const [cashUpgradeHasBadge, setCashUpgradeHasBadge] = useState<boolean>(false)
  const [prestigeUpgradeHasBadge, setPrestigeUpgradeHasBadge] = useState<boolean>(false)
  const [managerUpgradeHasBadge, setManagerUpgradeHasBadge] = useState<boolean>(false)

  return (
    <AppContext.Provider value={{
      taskIconHasBadge,
      setTaskIconHasBadge,
      cashUpgradeHasBadge,
      setCashUpgradeHasBadge,
      prestigeUpgradeHasBadge,
      setPrestigeUpgradeHasBadge,
      managerUpgradeHasBadge,
      setManagerUpgradeHasBadge,
    }}>
      { children }
    </AppContext.Provider>
  )
}

export default AppContextProvider