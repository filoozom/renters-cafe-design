import { Layout } from "./components/layout";

// Pages
import { PropertiesPage } from "./pages/properties";
import { FarmPage } from "./pages/farm/farm";

export function App() {
  return (
    <>
      <Layout>
        {/*<PropertiesPage />*/}
        <FarmPage />
      </Layout>
    </>
  );
}
