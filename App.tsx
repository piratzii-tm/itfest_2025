import {WithExpoFonts, WithTheming, WithReactContext} from "./src/wrappers";
import {Navigation} from "./src/navigation/navigation";

export default function App() {
    return <WithReactContext>
        <WithExpoFonts>
            <WithTheming>
                <Navigation/>
            </WithTheming>
        </WithExpoFonts>
    </WithReactContext>
}
