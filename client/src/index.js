import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import Loading from "components/Loading";
import dotenv from "dotenv";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import store from "./store";

import "./index.css";
import "@fontsource/spectral/400.css";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "../.env.local" });
}

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: true,
  },
  fonts: {
    body: "spectral",
  },
  styles: {
    global: {
      body: {
        overflow: { base: "none", md: "hidden" },
      },
    },
  },
});

ReactDOM.render(
  <Provider store={store}>
    <ChakraProvider theme={theme}>
      <Suspense fallback={<Loading />}>
        <Router>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App />
        </Router>
      </Suspense>
    </ChakraProvider>
  </Provider>,
  document.getElementById("root")
);
