import { StyleProp } from "react-native";

import PathRectangle from "./PathRectangle";
import WallRectangle from "./WallRectangle";
import AgentRectangle from "./AgentRectangle";
import TreasureRectangle from "./TreasureRectangle";
import PathVisitedRectangle from "./PathVisitedRectangle";
import PathTakenRectangle from "./PathTakenRectangle";
import PathAbandonedRectangle from "./PathAbandonedRectangle";

export interface RectangleProps<T> {
  height: number;
  width: number;
  style?: StyleProp<T>;
}

export const RectangleToComponent = {
  ["Wall" as RectangleName]: WallRectangle,
  ["Path" as RectangleName]: PathRectangle,
  ["Agent" as RectangleName]: AgentRectangle,
  ["Treasure" as RectangleName]: TreasureRectangle,
  ["PathVisited" as RectangleName]: PathVisitedRectangle,
  ["PathTaken" as RectangleName]: PathTakenRectangle,
  ["PathAbandoned" as RectangleName]: PathAbandonedRectangle,
};

export type RectangleName =
  | "Wall"
  | "Path"
  | "Agent"
  | "Treasure"
  | "PathVisited"
  | "PathTaken"
  | "PathAbandoned";
export const RECTANGLE_NAMES = [
  "Wall",
  "Path",
  "Agent",
  "Treasure",
  "PathVisited",
  "PathTaken",
  "PathAbandoned",
] as RectangleName[];

export function isRectPathType(rect: RectangleName) {
  return rect.startsWith("Path");
}
