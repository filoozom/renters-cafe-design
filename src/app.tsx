import { Router } from "@reach/router";

// Components
import { Layout } from "./components/layout";

// Pages
import { PropertiesPage } from "./pages/properties";
import { FarmPage } from "./pages/farm/farm";

export function App() {
  return (
    <>
      <Layout>
        <Router primary={false}>
          <FarmPage path="/" />
          <PropertiesPage path="/properties" />
        </Router>
      </Layout>
    </>
  );
}
