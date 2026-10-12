import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "./reducer.js";

const store = configureStore({
  reducer: {
    data: dataReducer,
  },
});

export default store;