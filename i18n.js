import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
  .use(HttpApi) // تحميل ملفات json
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "ar",

    supportedLngs: ["en", "ar"],

    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },

    interpolation: {
      escapeValue: false,
    },
  });

// RTL / LTR
i18n.on("languageChanged", (lng) => {
  document.dir = lng === "ar" ? "rtl" : "ltr";
});

export default i18n;
