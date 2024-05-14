import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider, createTheme } from "@mui/material/styles";
// import "./index.css";

const theme = createTheme({
  typography: {
    fontFamily: ["Noto Sans HK", "Hiragino Sans", "gensen-font-master"].join(
      ","
    ),
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
