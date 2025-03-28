import { BrowserRouter as Router } from "react-router-dom";

import { routes } from "@/lib/routes";
import ScrollToTop from "@/components/ScrollToTop";

import { initDB } from "react-indexed-db-hook";
import { DBConfig } from "./config/indexedDB";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apolloClient";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "@/App.css";
import "react-tooltip/dist/react-tooltip.css";
import { IdentityActivity } from "./components/IdentityActivity";
import { useEffect } from "react";

initDB(DBConfig);

function App() {
  useEffect(() => {
    window.addEventListener("unload", () => {
      document.documentElement.scrollTo(0, 0);
    });
  });
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ApolloProvider client={client}>
        <Router
          future={{
            v7_startTransition: true,
          }}
        >
          <ScrollToTop />
          <IdentityActivity></IdentityActivity>
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
      </ApolloProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
