import { configureStore } from "@reduxjs/toolkit";
import WeatherApiSliceReducer from "./WeatherApiSlice";

// Create and configure the Redux store
// This store will hold the global state of the application
const store = configureStore({
  reducer: {
    // Register the weather slice reducer
    // This allows accessing weather state via: state.weather
    weather: WeatherApiSliceReducer,
  },
});

// Export the store to be used in the app entry point (main.jsx)
export default store;
