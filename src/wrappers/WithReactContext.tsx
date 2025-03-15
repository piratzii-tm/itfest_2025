import { AuthContext, RootContext } from "../store";
import { useState } from "react";
import { ScannerContext } from "../store/scanner";

export const WithReactContext = ({ children }: { children }) => {
  const [confirmation, setConfirmation] = useState<null | any>(null);
  const [processing, setProcessing] = useState(false);
  const [uid, setUid] = useState("");
  const [scannedObject, setScannedObject] = useState(null);

  const rootContextValue = {
    processing,
    setProcessing,
  };

  const authContextValue = {
    confirmation,
    setConfirmation,
    uid,
    setUid,
  };

  const scannerContextValue = {
    scannedObject,
    setScannedObject,
  };

  return (
    <ScannerContext.Provider value={scannerContextValue}>
      <RootContext.Provider value={rootContextValue}>
        <AuthContext.Provider value={authContextValue}>
          {children}
        </AuthContext.Provider>
      </RootContext.Provider>
    </ScannerContext.Provider>
  );
};
