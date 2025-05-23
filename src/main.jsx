import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/fonts.css";
import "./index.css";
import "./styles/theme.css";
import App from "./App.jsx";
import { ThemeProvider } from "./contexts/ThemeContext";

// Set default theme to light
localStorage.setItem("theme", "light");

createRoot(document.getElementById("root")).render(
   <StrictMode>
      <ThemeProvider>
         <App />
      </ThemeProvider>
   </StrictMode>
);
