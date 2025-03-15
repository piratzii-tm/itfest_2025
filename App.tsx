import { Navigation } from "./src/navigation/navigation";
import {
  WithExpoFonts,
  WithLoading,
  WithReactContext,
  WithTheming,
  WithToast,
} from "./src/wrappers";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

export default function App() {
  return (
    <SafeAreaProvider>
      <WithTheming>
        <WithToast>
          <WithReactContext>
            <WithExpoFonts>
              <WithLoading>
                <ActionSheetProvider>
                  <Navigation />
                </ActionSheetProvider>
              </WithLoading>
            </WithExpoFonts>
          </WithReactContext>
        </WithToast>
      </WithTheming>
    </SafeAreaProvider>
  );
}
