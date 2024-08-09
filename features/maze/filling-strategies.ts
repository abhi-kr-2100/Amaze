import { RECTANGLE_NAMES } from "@/components/rectangles/common";
import sample from "lodash/sample";

export type FillingStrategy = "Random";

export default {
  ["Random" as FillingStrategy]: GetRandomRectangle,
};

function GetRandomRectangle(r: number, c: number) {
  return sample(RECTANGLE_NAMES)!;
}
