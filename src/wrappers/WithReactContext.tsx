import {AuthContext} from "../store";
import {useState} from "react";

export const WithReactContext = ({children}: { children }) => {
    const [confirmation, setConfirmation] = useState<null | any>(null)

    // @ts-ignore
    return <AuthContext.Provider value={{confirmation, setConfirmation}}>
        {children}
    </AuthContext.Provider>
}

