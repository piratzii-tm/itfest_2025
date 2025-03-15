import {Navigation} from "./src/navigation/navigation";
import {WithExpoFonts, WithReactContext, WithTheming} from "./src/wrappers";

export default function App() {
  return (
      <WithTheming>
        <WithReactContext>
          <WithExpoFonts>
            <Navigation />
          </WithExpoFonts>
        </WithReactContext>
      </WithTheming>
  );
}