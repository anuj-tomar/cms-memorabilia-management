import React from "react";
import ReactDOM from "react-dom";
// import * as serviceWorker from './serviceWorker';
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { renderRoutes } from "react-router-config";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../src/style/fontStyle.scss';
import '../src/style/style.scss';
import "../src/style/cropper.scss";
import "../src/style/slick.scss";

import Routes from "./routes";
import configureStore from "./store";
const { persistor, store } = configureStore({});

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>{renderRoutes(Routes)}</BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.unregister();
