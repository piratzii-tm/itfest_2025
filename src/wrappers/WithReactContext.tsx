import {AuthContext, RootContext} from "../store";
import {useState} from "react";

export const WithReactContext = ({children}: { children }) => {
    const [confirmation, setConfirmation] = useState<null | any>(null)
    const [processing, setProcessing] = useState(false)
    const [uid, setUid] = useState("")

    const rootContextValue = {
        processing,
        setProcessing,
    };

    const authContextValue = {
        confirmation, setConfirmation, uid, setUid
    }

    return <RootContext.Provider value={rootContextValue}>
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    </RootContext.Provider>
}

