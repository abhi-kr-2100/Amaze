import { StyleSheet, View, ViewStyle } from "react-native";
import { RectangleProps } from "./common";

export default function PathVisitedRectangle({
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

const PATH_VISITED_BG_COLOR = "yellow";

const defaultStyle = StyleSheet.create({
  root: {
    backgroundColor: PATH_VISITED_BG_COLOR,
  },
});
