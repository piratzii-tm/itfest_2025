import {AuthContext,RootContext} from "../store";
import {useState} from "react";

export const WithReactContext = ({children}: { children }) => {
    const [confirmation, setConfirmation] = useState<null | any>(null)
    const [processing, setProcessing] = useState(false)

    const rootContextValue = {
        processing,
        setProcessing,
    };

    return <RootContext.Provider value={rootContextValue}>
        <AuthContext.Provider value={{confirmation, setConfirmation}}>
            {children}
        </AuthContext.Provider>
    </RootContext.Provider>
}

