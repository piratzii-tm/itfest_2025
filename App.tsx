import {Navigation} from "./src/navigation/navigation";
import {WithExpoFonts, WithLoading, WithReactContext, WithTheming} from "./src/wrappers";

export default function App() {
    return (
        <WithTheming>
            <WithReactContext>
                <WithExpoFonts>
                    <WithLoading>
                        <Navigation/>
                    </WithLoading>
                </WithExpoFonts>
            </WithReactContext>
        </WithTheming>
    );
}