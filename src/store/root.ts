import {createContext} from "react";

export const RootContext = createContext({
    // Handle the processing of the image
    processing: false,
    setProcessing: (value: boolean) => {
    }
});