import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AdminEditPage from "./pages/AdminEditPage.jsx";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
// import "./index.css";

const theme = createTheme({
  typography: {
    fontFamily: [
      "Noto Sans HK",
      "Hiragino Sans",
      "gensen-font-master",
      "Hiragino Sans GB W05 W4",
      "gensen font master",
    ].join(","),
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/voting" element={<App />} />
          <Route path="/voting/664b20f7cbd11e4bca2386c8" element={<App />} />
          <Route path="/admin/edit" element={<AdminEditPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);
