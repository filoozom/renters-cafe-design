import { render } from "preact";
import "./index.css";

// Components
import { Layout } from "./components/layout";

// Pages
import { HomePage } from "./pages/home";

render(
  <Layout onlyHome={true}>
    <HomePage />
  </Layout>,
  document.getElementById("app")!
);
