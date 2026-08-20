import { Route } from "@solidjs/router";

import { Converter } from "./app/converter";
import { Docs } from "./app/docs";
import { AutoSplitters } from "./app/docs/auto-splitters";
import { SettingsKeybinds } from "./app/docs/settings-keybinds";
import { SplitFiles } from "./app/docs/split-files";
import { Themes } from "./app/docs/themes";
import { Troubleshooting } from "./app/docs/troubleshooting";
import { Home } from "./app/home";
import { NotFound } from "./app/not-found";

export default function AppRouter() {
  return (
    <>
      <Route path="/" component={Home} />
      <Route path="/docs" component={Docs} />
      <Route path="/converter" component={Converter} />

      {/* Documentation pages pulled from GitHub. */}
      <Route path="/docs/auto-splitters.md" component={AutoSplitters} />
      <Route path="/docs/settings-keybinds.md" component={SettingsKeybinds} />
      <Route path="/docs/split-files.md" component={SplitFiles} />
      <Route path="/docs/themes.md" component={Themes} />
      <Route path="/docs/troubleshooting.md" component={Troubleshooting} />

      {/* Fall back on app's 404 page. This is because of the SPA routing trick with 404.html used in GitHub Pages. */}
      <Route path="*404" component={NotFound} />
    </>
  );
}
