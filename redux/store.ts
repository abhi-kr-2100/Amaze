import { configureStore } from "@reduxjs/toolkit";
import mazeReducer from "../features/maze/maze-slice";

export const store = configureStore({
  reducer: {
    maze: mazeReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
