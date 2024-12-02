import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MemeGenerator from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MemeGenerator />
  </StrictMode>
);
