import {createContext} from "react";

export const AuthContext = createContext({
    // Confirmation code that will be used for the authentication
    confirmation: null,
    setConfirmation: (value: any) => {
    }
});