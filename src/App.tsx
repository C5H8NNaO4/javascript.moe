import { BrowserRouter as Router } from "react-router-dom";
import "@/App.css";
import { routes } from "@/lib/routes";
import ScrollToTop from "@/components/ScrollToTop";

import { initDB } from "react-indexed-db-hook";
import { DBConfig } from "./config/indexedDB";

initDB(DBConfig);

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
      }}
    >
      <ScrollToTop />
      {/* <img
      alt="Moosweiher in Freiburg mit einer Ente am Ufer"
      src="/images/wallpaper/1.webp"
      style={{
        zIndex: -1,
        position: 'absolute',
        height: "120lvh",
        aspectRatio: "initial",
        objectFit: "cover",
        width: "calc(100vw - (100vw - 100%))",
        filter: 'saturate(0%)'
      }}
    /> */}
      {routes}
    </Router>
  );
}

export default App;
