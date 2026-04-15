import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import FinalPage from "./FinalHome.jsx";
import AdminEditPage from "./pages/AdminEditPage.jsx";
import AdminEditPageFinal from "./pages/AdminEditPageFinal.jsx";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

const theme = createTheme({
  typography: {
    fontFamily: [
      "Noto Sans HK",
      "Hiragino Sans",
      "gensen-font-master",
      "Hiragino Sans GB W05 W4",
      "gensen font master",
      "Hiragino Sans W8",
    ].join(","),
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/voting-2026" element={<App />} />
          <Route path="/final-2026" element={<FinalPage />} />
          <Route
            path="/final-2026/664b20f7cbd11e4bca2386c8"
            element={<FinalPage />}
          />
          <Route path="/voting-2026/664b20f7cbd11e4bca2386c8" element={<App />} />
          <Route path="/admin-2026/edit" element={<AdminEditPage />} />
          <Route path="/admin-2026/edit/final" element={<AdminEditPageFinal />} />
        </Routes>
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);
