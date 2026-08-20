import { Router } from "@solidjs/router";

import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { render } from "solid-js/web";

import App from "./app";
import { ThemeProvider } from "./lib/theme";
import AppRouter from "./router";

const queryClient = new QueryClient();

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router root={App}>
          <AppRouter />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  ),
  document.getElementById("root")!,
);
