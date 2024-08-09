import { RECTANGLE_NAMES } from "@/components/rectangles/common";
import sample from "lodash/sample";

export type FillingStrategy = "Random";

export default {
  ["Random" as FillingStrategy]: GetRandomlyFilledMaze,
};

function GetRandomlyFilledMaze(nrows: number, ncols: number) {
  const maze = Array.from(Array(nrows), () =>
    Array.from(Array(ncols), () => sample(RECTANGLE_NAMES)!)
  );

  return maze;
}
