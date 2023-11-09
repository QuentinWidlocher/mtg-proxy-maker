/* @refresh reload */
import { render } from "solid-js/web";
import "./main.css";

import App from "./app";

render(() => {
  return <App />;
}, document.getElementById("root")!);
