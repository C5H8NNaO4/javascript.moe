import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import i18n from "i18next";
import { supportedLngs } from "@/lib/i18n";

export const EnsureLanguage = ({ path = "" }) => {
  const navigate = useNavigate();
  const { language } = useParams();
  useEffect(() => {
    if (window.location.toString().includes("me.javascript.moe")) {
      return navigate("/Moritz Roessler.vcf", {
        replace: true,
      });
    }
    if (!supportedLngs.includes(language || "en"))
      navigate("/" + i18n.language + path, {
        replace: true,
      });
  }, []);

  return null;
};
