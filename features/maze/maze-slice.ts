import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import defaultMaze from "./default-maze";

export interface MazeState {
  nrows: number;
  ncols: number;
  rectangles: any[][];
}

const mazeSlice = createSlice({
  name: "maze",
  initialState: defaultMaze,
  reducers: {
    resized(state, action: PayloadAction<[number, number]>) {
      state.nrows = action.payload[0];
      state.ncols = action.payload[1];

      let newRects: any[][] = [];
      for (let r = 0; r < state.nrows; ++r) {
        newRects.push([]);
        for (let c = 0; c < state.ncols; ++c) {
          if (state.rectangles.length < r && state.rectangles[r].length < c) {
            newRects[r].push(state.rectangles[r][c]);
          } else {
            newRects[r].push(0);
          }
        }
      }

      state.rectangles = newRects;
    },
  },
});

export default mazeSlice.reducer;
