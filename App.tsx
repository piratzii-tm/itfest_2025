import {Navigation} from "./src/navigation/navigation";
import {WithExpoFonts, WithLoading, WithReactContext, WithTheming, WithToast} from "./src/wrappers";
import {SafeAreaProvider} from "react-native-safe-area-context";

export default function App() {
    return (
        <SafeAreaProvider>
            <WithTheming>
                <WithToast>
                    <WithReactContext>
                        <WithExpoFonts>
                            <WithLoading>
                                <Navigation/>
                            </WithLoading>
                        </WithExpoFonts>
                    </WithReactContext>
                </WithToast>
            </WithTheming>
        </SafeAreaProvider>
    );
}