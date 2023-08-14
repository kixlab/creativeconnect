import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import configureKonvaEditorStore from "./redux/store";
import "./i18n";
import { PersistGate } from "redux-persist/integration/react";

const { store, persistor } = configureKonvaEditorStore();

const rootElement = document.getElementById("root");
if (rootElement === null) {
  throw Error("rootElement is null");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
