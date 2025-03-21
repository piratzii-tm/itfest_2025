import { createContext } from "react";
import { ReceiptData } from "../constants/types";

interface ScannerContextType {
  scannedObject: ReceiptData | null;
  setScannedObject: (value: ReceiptData | null) => void;
}

export const ScannerContext = createContext<ScannerContextType>({
  // Scanned object resulted after the computation by OpenAI
  scannedObject: null,
  setScannedObject: (value: any) => {},
});
