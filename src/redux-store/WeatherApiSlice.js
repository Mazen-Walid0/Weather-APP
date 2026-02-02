// Import createSlice and createAsyncThunk from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Import axios for making HTTP requests
import axios from "axios";

// Create an async thunk to fetch weather data from OpenWeather API
export const featchWeather = createAsyncThunk(
  "weatherApi/fetchWeather",
  async () => {
    // Send GET request to OpenWeather API with location and API key
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather?lat=30.0444&lon=31.2357&appid=13d12b2ef3ae82b684f7b2461437c8d5&units=metric",
    );

    // Round current temperature to nearest integer
    const weatherDegree = Math.round(response.data.main.temp);

    // Get weather description (example: clear sky, cloudy, etc.)
    const description = response.data.weather[0]?.description;

    // Get minimum temperature (rounded down)
    const minDegree = Math.floor(response.data.main.temp_min);

    // Get maximum temperature (rounded down)
    const maxDegree = Math.floor(response.data.main.temp_max);

    // Build weather icon URL using icon code from API
    const iconWeather = `https://openweathermap.org/img/wn/${response.data.weather[0]?.icon || ""}@2x.png`;

    // Return formatted weather data to be stored in Redux state
    return { weatherDegree, description, minDegree, maxDegree, iconWeather };
  },
);

// Create a Redux slice for weather API data
const WeatherApiSlice = createSlice({
  // Slice name (used in Redux store)
  name: "weatherapi",

  // Initial state for this slice
  initialState: {
    result: "empty", // Custom state value (can be used for status tracking)
    weather: {}, // Stores fetched weather data
    Loding: false, // Indicates loading state (true when fetching data)
  },

  // Synchronous reducers
  reducers: {
    // Change result value manually
    changeResult: (state) => {
      state.result = "changed";
    },
  },

  // Handle async actions (pending, fulfilled, rejected)
  extraReducers(builder) {
    builder
      // When API request starts
      .addCase(featchWeather.pending, (state) => {
        state.Loding = true;
      })

      // When API request succeeds
      .addCase(featchWeather.fulfilled, (state, { payload }) => {
        state.weather = payload; // Save weather data
        state.Loding = false; // Stop loading
      })

      // When API request fails
      .addCase(featchWeather.rejected, (state) => {
        state.Loding = false; // Stop loading on error
      });
  },
});

// Export action for changing result
export const { changeResult } = WeatherApiSlice.actions;

// Export reducer to use in Redux store
export default WeatherApiSlice.reducer;
