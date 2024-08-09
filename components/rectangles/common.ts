import { StyleProp } from "react-native";

import PathRectangle from "./PathRectangle";
import WallRectangle from "./WallRectangle";
import AgentRectangle from "./AgentRectangle";
import TreasureRectangle from "./TreasureRectangle";

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
};

export type RectangleName = "Wall" | "Path" | "Agent" | "Treasure";
export const RECTANGLE_NAMES = [
  "Wall",
  "Path",
  "Agent",
  "Treasure",
] as RectangleName[];
