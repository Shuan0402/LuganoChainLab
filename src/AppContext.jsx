import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [appState, setAppState] = useState({
        account: null,
        did: null
    });

    return (
        <AppContext.Provider value={{ appState, setAppState }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppState = () => {
    const context = useContext(AppContext);
    return context;
}