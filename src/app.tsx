import { Router } from "@reach/router";

// Lib
import { client, Provider } from "./lib/urql";

// Components
import { Layout } from "./components/layout";

// Pages
import { FarmPage } from "./pages/farm/farm";
import { HomePage } from "./pages/home";
import { AuctionsPage } from "./pages/auctions";
import { StealingPage } from "./pages/stealing";
import { AlertsProvider } from "./components/alerts/alerts";

export const App = () => (
  <Provider value={client}>
    <AlertsProvider>
      <Layout>
        <Router primary={false} style={{ height: "100%" }}>
          <HomePage path="/" />
          <FarmPage path="/farm" />
          <AuctionsPage path="/auctions" />
          <StealingPage path="/stealing" />
        </Router>
      </Layout>
    </AlertsProvider>
  </Provider>
);
