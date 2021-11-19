import { Router } from "@reach/router";
import { createClient, Provider } from "urql";

// Components
import { Layout } from "./components/layout";

// Pages
import { PropertiesPage } from "./pages/properties";
import { FarmPage } from "./pages/farm/farm";

const client = createClient({
  url: "http://srv02.apyos.com:8000/subgraphs/name/renter-cafe/cafe",
});

export function App() {
  return (
    <Provider value={client}>
      <Layout>
        <Router primary={false}>
          <FarmPage path="/" />
          <PropertiesPage path="/properties" />
        </Router>
      </Layout>
    </Provider>
  );
}
