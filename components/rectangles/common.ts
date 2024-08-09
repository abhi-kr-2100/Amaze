import { StyleProp } from "react-native";

export interface RectangleProps<T> {
  height: number;
  width: number;
  style?: StyleProp<T>;
}
