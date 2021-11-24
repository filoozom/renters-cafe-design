import { Router } from "@reach/router";

// Lib
import { client, Provider } from "./lib/urql";

// Components
import { Layout } from "./components/layout";

// Pages
import { PropertiesPage } from "./pages/properties";
import { FarmPage } from "./pages/farm/farm";
import { HomePage } from "./pages/home";
import { AuctionsPage } from "./pages/auctions";

export const App = () => (
  <Provider value={client}>
    <Layout>
      <Router primary={false}>
        <FarmPage path="/" />
        <PropertiesPage path="/properties" />
        <AuctionsPage path="/auctions" />
        <HomePage path="/home" />
      </Router>
    </Layout>
  </Provider>
);
