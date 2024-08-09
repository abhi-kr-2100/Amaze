import fillingStrategies, { FillingStrategy } from "./filling-strategies";
import { MazeState } from "./maze-slice";

export const DEFAULT_NROWS = 10;
export const DEFAULT_NCOLS = 20;

export const DEFAULT_FILLING_STRATEGY = "Random" as FillingStrategy;

export default {
  nrows: DEFAULT_NROWS,
  ncols: DEFAULT_NCOLS,
  rectangles: fillingStrategies[DEFAULT_FILLING_STRATEGY](
    DEFAULT_NROWS,
    DEFAULT_NCOLS
  ),
  fillingStrategy: DEFAULT_FILLING_STRATEGY,
} as MazeState;
