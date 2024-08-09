import { RectangleName } from "@/components/rectangles/common";
import sample from "lodash/sample";

export type FillingStrategy = "Random";

export default {
  ["Random" as FillingStrategy]: GetRandomRectangle,
};

const RECTANGLES = ["Wall", "Path"] as RectangleName[];

function GetRandomRectangle(r: number, c: number) {
  return sample(RECTANGLES)!;
}
