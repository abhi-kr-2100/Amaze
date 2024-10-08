import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import defaultMaze from "./default-maze";
import fillingStrategies, { FillingStrategy } from "./filling-strategies";
import {
  HISTORICAL_RECTS,
  RectangleName,
} from "@/components/rectangles/common";
import { SingleMazeDiff } from "../search/ISearch";
import { Coord2D } from "./common";

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

      let newRects = fillingStrategies[state.fillingStrategy](
        state.nrows,
        state.ncols
      );

      const prevNRows = state.rectangles.length;
      const prevNCols = prevNRows !== 0 ? state.rectangles[0].length : 0;
      for (let r = 0; r < state.nrows; ++r) {
        for (let c = 0; c < state.ncols; ++c) {
          if (r < prevNRows && c < prevNCols) {
            newRects[r][c] = state.rectangles[r][c];
          }
        }
      }

      state.rectangles = newRects;
    },

    fillingStrategyChanged(state, action: PayloadAction<FillingStrategy>) {
      state.fillingStrategy = action.payload;
      state.rectangles = fillingStrategies[state.fillingStrategy](
        state.nrows,
        state.ncols
      );
    },

    rectangleChanged(
      state,
      action: PayloadAction<{ coord: Coord2D; newRect: RectangleName }>
    ) {
      const { coord, newRect } = action.payload;

      state.rectangles[coord[0]][coord[1]] = newRect;
    },

    rectanglesChanged(state, action: PayloadAction<SingleMazeDiff[]>) {
      for (var diff of action.payload) {
        state.rectangles[diff.coord[0]][diff.coord[1]] = diff.newRect;
      }
    },

    historicalRectsCleared(state) {
      state.rectangles.forEach((row, r) =>
        row.forEach((rect, c) => {
          if (!HISTORICAL_RECTS.includes(rect)) {
            return;
          }

          state.rectangles[r][c] = "Path";
        })
      );
    },
  },
});

export const {
  resized,
  fillingStrategyChanged,
  rectangleChanged,
  rectanglesChanged,
  historicalRectsCleared,
} = mazeSlice.actions;
export default mazeSlice.reducer;
