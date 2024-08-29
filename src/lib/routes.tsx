import { AboutPage } from "@/pages/AboutPage";
import { LandingPage } from "@/pages/LandingPage";
import { Route, Routes } from "react-router";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import i18n from "i18next";
import { IngredientPage, PerfumePage } from "@/pages/ParfumPage";

export const RedirectToLanguage = ({ path = "" }) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/" + i18n.language + path);
  }, []);

  return null;
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
    <Route path="/:language/perfumes" Component={PerfumePage} />,
    <Route path="/:language/ingredients" Component={IngredientPage} />
    <Route path="/:language" Component={LandingPage}></Route>
  </Routes>
);
