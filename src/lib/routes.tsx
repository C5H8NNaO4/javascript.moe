import { AboutPage } from "@/pages/AboutPage";
import { LandingPage } from "@/pages/LandingPage";
import { Route, Routes } from "react-router";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ReactDOM from "react-dom";
import i18n from "i18next";
import {
  DiscoverPage,
  FormulaPage,
  FragrancePage,
  IngredientPage,
  InventoryPage,
  PerfumePage,
  PublishPage,
} from "@/pages/ParfumPage";

export const RedirectToLanguage = ({ path = "", replace = true }) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/" + i18n.language + path, { replace });
  }, []);

  return ReactDOM.createPortal(
    <>
      <meta name="robots" content="noindex"></meta>
    </>,
    document.head
  );
};

export const RedirectTo404 = () => {
  return <RedirectToLanguage path="/404" />;
};

export const RedirectToAboutPage = () => {
  return <RedirectToLanguage path="/about" />;
};

export const RedirectToPerfumesPage = () => {
  return <RedirectToLanguage path="/perfumes" />;
};

export const RedirectToIngredientsPage = () => {
  return <RedirectToLanguage path="/ingredients" />;
};
export const routes = (
  <Routes>
    <Route path="/" Component={RedirectToLanguage} />,
    <Route path="/about" Component={RedirectToAboutPage} />,
    <Route path="/perfumes" Component={RedirectToPerfumesPage} />,
    <Route path="/ingredients" Component={RedirectToIngredientsPage} />,
    <Route path="/:language/about" Component={AboutPage} />
    <Route path="/:language/404" Component={AboutPage} />
    <Route path="/:language/perfumes" Component={PerfumePage} />,
    <Route path="/:language/ingredients" Component={IngredientPage} />,
    <Route path="/:language/inventory" Component={InventoryPage} />
    <Route path="/:language/formulas" Component={DiscoverPage} />
    

    <Route path="/:language/formula/compose" Component={FragrancePage} />
    <Route path="/:language/formula/compose/:listId" Component={FragrancePage} />
    <Route path="/:language/formula/:author/:title/" Component={FormulaPage} />
    <Route
      path="/:language/formula/publish/:formulaId"
      Component={PublishPage}
    />
    <Route path="/:language/inventory/:list/" Component={InventoryPage} />,
    <Route path="/:language/inventory/:list/:title" Component={InventoryPage} />
    ,
    <Route
      path="/:language/inventory/:list/:title/:amount"
      Component={InventoryPage}
    />
    ,<Route path="/:language" Component={LandingPage}></Route>
  </Routes>
);
