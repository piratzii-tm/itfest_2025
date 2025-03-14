import {WithExpoFonts, WithTheming} from "./src/wrappers";
import {Text} from "react-native-ui-lib";

export default function App() {
    return <WithExpoFonts>
        <WithTheming>
            <Text bold center>Hello</Text>
        </WithTheming>
    </WithExpoFonts>
}
