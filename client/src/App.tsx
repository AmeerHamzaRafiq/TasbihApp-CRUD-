import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Counter from "@/pages/counter.jsx";
import History from "./pages/history";
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/Counter/:id" component={Counter} />
      {/* <Route path="/history" element={<History />} /> */}

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;