import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("Lumina-Secure Application Started");

createRoot(document.getElementById("root")!).render(<App />);
