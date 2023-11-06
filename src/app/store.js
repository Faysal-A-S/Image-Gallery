import { configureStore } from "@reduxjs/toolkit";
import deleteImageSlice from "../features/deleteImageSlice";

export const store = configureStore({
  reducer: {
    checked: deleteImageSlice,
  },
});
