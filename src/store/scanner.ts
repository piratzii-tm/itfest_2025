import { createContext } from "react";

export const ScannerContext = createContext({
  // Scanned object resulted after the computation by OpenAI
  scannedObject: null,
  setScannedObject: (value: any) => {},
});
