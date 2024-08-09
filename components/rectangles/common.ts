import { StyleProp } from "react-native";

import PathRectangle from "./PathRectangle";
import WallRectangle from "./WallRectangle";
import AgentRectangle from "./AgentRectangle";
import TreasureRectangle from "./TreasureRectangle";
import VisitedRectangle from "./VisitedRectangle";

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
  ["Visited" as RectangleName]: VisitedRectangle,
};

export type RectangleName = "Wall" | "Path" | "Agent" | "Treasure" | "Visited";
export const RECTANGLE_NAMES = [
  "Wall",
  "Path",
  "Agent",
  "Treasure",
  "Visited",
] as RectangleName[];
