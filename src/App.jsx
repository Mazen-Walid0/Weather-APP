// ===============================
// Import translation hook from react-i18next
// Used for handling multi-language support
// ===============================
import { useTranslation } from "react-i18next";

// App main styles
import "./App.css";

// HTTP client for API requests
import axios from "axios";

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
  const [data, setData] = useState({
    number: null, // Current temperature
    description: "", // Weather description
    min: null, // Minimum temperature
    max: null, // Maximum temperature
    icon: null, // Weather icon URL
  });

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
    // Sync i18n language with local state
    i18n.changeLanguage(locale);

    // Create AbortController to cancel request if needed
    const controller = new AbortController();

    // Send request to OpenWeatherMap API
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=30.0444&lon=31.2357&appid=13d12b2ef3ae82b684f7b2461437c8d5&units=metric",
        {
          signal: controller.signal,
        },
      )
      .then((res) => {
        // Store processed weather data in state
        setData({
          number: Math.round(res.data.main.temp), // Current temperature
          description: res.data.weather[0]?.description || "", // Weather description
          min: Math.floor(res.data.main.temp_min), // Min temperature
          max: Math.floor(res.data.main.temp_max), // Max temperature

          // Build icon URL dynamically
          icon: `https://openweathermap.org/img/wn/${
            res.data.weather[0]?.icon || ""
          }@2x.png`,
        });
      })
      .catch((err) => {
        // Ignore canceled requests
        if (err.name !== "CanceledError") {
          console.error(err);
        }
      });

    // Cancel request on component unmount
    return () => controller.abort();
  }, [locale]);

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
                        {t(data.number)}
                      </Typography>
                      {/* Todo: Start Temp Image */}
                      {data.icon && <img src={data.icon} alt="weather" />}
                      {/* Todo: End Temp Image */}
                    </div>
                    {/* End Temp */}
                    <Typography variant="h6">
                      {t(data.description.replace(" ", "_"))}
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
                        {t("minor")} : {t(data.min)}
                      </h5>
                      <h5 style={{ margin: "0px 7px" }}>|</h5>
                      <h5>
                        {t("grand")} : {t(data.max)}
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
