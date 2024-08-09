import fillingStrategies, { FillingStrategy } from "./filling-strategies";
import { MazeState } from "./maze-slice";

export const DEFAULT_NROWS = 10;
export const DEFAULT_NCOLS = 20;

export default {
  nrows: DEFAULT_NROWS,
  ncols: DEFAULT_NCOLS,
  rectangles: Array.from(Array(DEFAULT_NROWS), (_, c) =>
    Array.from(Array(DEFAULT_NCOLS), (_, r) =>
      fillingStrategies["Random"](r, c)
    )
  ),
  fillingStrategy: "Random" as FillingStrategy,
} as MazeState;
