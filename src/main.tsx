import App from "./app";
import "./index.css";
import { ThemeProvider } from "./lib/theme";
import AppRouter from "./router";
import { Router } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { render } from "solid-js/web";

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
