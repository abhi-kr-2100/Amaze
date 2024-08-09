import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import defaultMaze from "./default-maze";
import fillingStrategies, { FillingStrategy } from "./filling-strategies";
import { RectangleName } from "@/components/rectangles/common";

export interface MazeState {
  nrows: number;
  ncols: number;
  rectangles: RectangleName[][];
  fillingStrategy: FillingStrategy;
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
            newRects[r].push(fillingStrategies[state.fillingStrategy](r, c));
          }
        }
      }

      state.rectangles = newRects;
    },

    fillingStrategyChanged(state, action: PayloadAction<FillingStrategy>) {
      state.fillingStrategy = action.payload;

      for (let r = 0; r < state.nrows; ++r) {
        for (let c = 0; c < state.ncols; ++c) {
          state.rectangles[r][c] = fillingStrategies[state.fillingStrategy](
            r,
            c
          );
        }
      }
    },

    rectangleChanged(
      state,
      action: PayloadAction<{ coord: [number, number]; newRect: RectangleName }>
    ) {
      const { coord, newRect } = action.payload;

      state.rectangles[coord[0]][coord[1]] = newRect;
    },
  },
});

export const { resized, fillingStrategyChanged, rectangleChanged } =
  mazeSlice.actions;
export default mazeSlice.reducer;
