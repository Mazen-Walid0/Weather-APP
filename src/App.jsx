// ===============================
// Import translation hook from react-i18next
// Used for handling multi-language support
// ===============================
import { useTranslation } from "react-i18next";

// App main styles
import "./App.css";

// HTTP client for API requests

// React core hooks
import { useState, useEffect } from "react";

// ===============================
// Material UI imports (UI framework)
// ===============================
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

// Redux Import
import { useSelector, useDispatch } from "react-redux";
import { featchWeather } from "./redux-store/WeatherApiSlice";

// ===============================
// Moment.js for date & time handling
// Using full locale support
// ===============================
import moment from "moment/min/moment-with-locales";

// Set default locale to Arabic
moment.locale("ar");

// ===============================
// Custom Material UI theme
// Defines fonts and font weights
// ===============================
const theme = createTheme({
  typography: {
    fontFamily: [
      "IBM",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "sans-serif",
    ].join(","),
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
});

export default function App() {
  // Redux Code
  const dispatch = useDispatch();

  // const result = useSelector((state) => {
  //   return state.result;
  // });

  const Loding = useSelector((state) => state.weather.Loding);

  const weather = useSelector((state) => state.weather.weather);

  // Get translation function and language controller
  const { t, i18n } = useTranslation();

  // ===============================
  // State: Current date & time
  // ===============================
  let [dateAndTime, setDateAndTime] = useState(null);

  // ===============================
  // State: Weather data object
  // Stores temperature and weather info
  // ===============================

  // ===============================
  // State: Current language
  // Default is English
  // ===============================
  const [locale, setLocal] = useState("en");

  // ===============================
  // Toggle between Arabic and English
  // Updates both local state and i18n language
  // ===============================
  function handleLanguageClick() {
    if (locale === "en") {
      setLocal("ar");
      i18n.changeLanguage("ar");
    } else {
      setLocal("en");
      i18n.changeLanguage("en");
    }
  }

  // ===============================
  // Update Moment.js locale when language changes
  // ===============================
  useEffect(() => {
    moment.locale(locale);
  }, [locale]);

  // ===============================
  // Update date & time every second
  // Uses setInterval and clears on unmount
  // ===============================
  useEffect(() => {
    const updateTime = () => {
      setDateAndTime(moment().format("dddd, D MMMM YYYY, HH:mm:ss"));
    };

    // Initialize time immediately
    updateTime();

    // Update time every second
    const interval = setInterval(updateTime, 1000);

    // Cleanup interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  // ===============================
  // Fetch weather data when language changes
  // Also updates translation language
  // ===============================
  useEffect(() => {
    // Fetch weather data
    dispatch(featchWeather());
    // Sync i18n language with local state
    i18n.changeLanguage(locale);
  }, [locale, i18n, dispatch]);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container
          maxWidth="sm"
          sx={{ direction: locale === "ar" ? "rtl" : "ltr" }}
        >
          {/* Start Content Container */}
          <div
            className="content-container"
            style={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {/* Start Loding */}
            <Backdrop
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
              }}
              open={Loding}
            >
              <CircularProgress size={100} />
            </Backdrop>
            {/* End Loding */}
            {/* Start Card */}
            <div
              className="card"
              style={{
                width: "100%",
                backgroundColor: "rgb(28 52 91 / 36%)",
                padding: "20px",
                borderRadius: "15px",
                boxShadow: "0px 11px 1px rgba(0,0,0,0.05)",
              }}
            >
              {/* Start Content */}
              <div className="content">
                {/* Start City & Time */}
                <div
                  className="city-and-time"
                  style={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "start",
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{ marginRight: "20px", fontWeight: "600" }}
                  >
                    {t("cairo")}
                  </Typography>
                  <Typography variant="h5" sx={{ marginRight: "20px" }}>
                    {dateAndTime}
                  </Typography>
                </div>
                {/* End City & Time */}
                <hr />
                {/* Start Of Degree + Cloud Icon */}
                <div
                  className="degree-cloud-icon"
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  {/* Start Degree & Description */}
                  <div className="degree-description">
                    {/* Start Temp */}
                    <div
                      className="temp"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h1" sx={{ textAlign: "right" }}>
                        {t(weather.weatherDegree)}
                      </Typography>
                      {/* Todo: Start Temp Image */}
                      {weather.iconWeather && (
                        <img src={weather.iconWeather} alt="weather" />
                      )}
                      {/* Todo: End Temp Image */}
                    </div>
                    {/* End Temp */}
                    <Typography variant="h6">
                      {weather.description &&
                        t(weather.description.replace(" ", "_"))}
                    </Typography>
                    {/* Start Min & Max */}
                    <div
                      className="min-max"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h5>
                        {t("minor")} : {t(weather.minDegree)}
                      </h5>
                      <h5 style={{ margin: "0px 7px" }}>|</h5>
                      <h5>
                        {t("grand")} : {t(weather.maxDegree)}
                      </h5>
                    </div>
                    {/* End Min & Max */}
                  </div>
                  {/* End Degree & Description */}
                  <CloudIcon sx={{ fontSize: "200px", color: "white" }} />
                </div>
                {/* End Of Degree + Cloud Icon */}
              </div>
              {/* End Content */}
            </div>
            {/* Start Translation Container */}
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                width: "100%",
                marginTop: "15px",
              }}
            >
              <Button
                sx={{ color: "white" }}
                variant="text"
                onClick={handleLanguageClick}
              >
                {locale === "en" ? "Arabic" : "إنجليزى"}
              </Button>
            </div>
            {/* End Translation Container */}
            {/* End Card */}
          </div>
          {/* End Content Container */}
        </Container>
      </ThemeProvider>
    </div>
  );
}
