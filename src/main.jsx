import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom"; 
import App from "./App.jsx";
import "./styles/global.css";
import "./styles/theme.css"; 
import { FavoritesProvider } from "./context/FavoritesContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LoadingProvider } from './context/LoadingProvider'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FavoritesProvider>
      <LoadingProvider>
      <ThemeProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </ThemeProvider>
      </LoadingProvider>
    </FavoritesProvider>
  </React.StrictMode>
);