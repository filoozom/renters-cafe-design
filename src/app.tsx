import { Router } from "@reach/router";

// Lib
import { client, Provider } from "./lib/urql";

// Components
import { Layout } from "./components/layout";

// Pages
import { PropertiesPage } from "./pages/properties";
import { FarmPage } from "./pages/farm/farm";

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
