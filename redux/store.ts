import { configureStore } from "@reduxjs/toolkit";
import mazeReducer from "../features/maze/maze-slice";
import controlsReducer from "../features/controls/controls-slice";

export const store = configureStore({
  reducer: {
    maze: mazeReducer,
    controls: controlsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
