import { StyleSheet, View, ViewStyle } from "react-native";
import { RectangleProps } from "./common";

export default function WallRectangle({
  height,
  width,
  style,
}: RectangleProps<ViewStyle>) {
  return (
    <View
      style={[
        defaultStyle.root,
        {
          height,
          width,
        },
        style,
      ]}
    ></View>
  );
}

const WALL_BG_COLOR = "black";

const defaultStyle = StyleSheet.create({
  root: {
    backgroundColor: WALL_BG_COLOR,
  },
});
