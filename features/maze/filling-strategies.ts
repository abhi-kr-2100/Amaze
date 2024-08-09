import { RECTANGLE_NAMES } from "@/components/rectangles/common";
import sample from "lodash/sample";

export type FillingStrategy = "Random" | "RandomWithAAndTOnCorners";

export default {
  ["Random" as FillingStrategy]: GetRandomlyFilledMaze,
  ["RandomWithAAndTOnCorners" as FillingStrategy]:
    GetRandomlyFilledMazeWithAgentAndTreasureOnCorners,
};

function GetRandomlyFilledMaze(
  nrows: number,
  ncols: number,
  rects = RECTANGLE_NAMES
) {
  const maze = Array.from(Array(nrows), () =>
    Array.from(Array(ncols), () => sample(rects)!)
  );

  return maze;
}

function GetRandomlyFilledMazeWithAgentAndTreasureOnCorners(
  nrows: number,
  ncols: number
) {
  let maze = GetRandomlyFilledMaze(nrows, ncols, ["Path", "Wall"]);
  maze[nrows - 1][0] = "Agent";
  maze[0][ncols - 1] = "Treasure";

  return maze;
}
