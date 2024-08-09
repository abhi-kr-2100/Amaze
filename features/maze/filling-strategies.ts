import sample from "lodash/sample";

import PathRectangle from "@/components/rectangles/PathRectangle";
import WallRectangle from "@/components/rectangles/WallRectangle";

export type FillingStrategy = "Random";
export type RectangleName = "Wall" | "Path";

export default {
  ["Random" as FillingStrategy]: GetRandomRectangle,
};

export const RectangleToComponent = {
  ["Wall" as RectangleName]: WallRectangle,
  ["Path" as RectangleName]: PathRectangle,
};

const RECTANGLES = ["Wall", "Path"] as RectangleName[];

function GetRandomRectangle(r: number, c: number) {
  return sample(RECTANGLES)!;
}
