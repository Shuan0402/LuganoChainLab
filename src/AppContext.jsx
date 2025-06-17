import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [appState, setAppState] = useState({
        account: null,
        did: null,
        vc: null,
        ipfsUrl: null
    });

    return (
        <AppContext.Provider value={{ appState, setAppState }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppState = () => useContext(AppContext);