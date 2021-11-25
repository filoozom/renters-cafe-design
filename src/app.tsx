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

export const App = () => (
  <Provider value={client}>
    <Layout>
      <Router primary={false}>
        <FarmPage path="/" />
        <AuctionsPage path="/auctions" />
        <StealingPage path="/stealing" />
        <HomePage path="/home" />
      </Router>
    </Layout>
  </Provider>
);
