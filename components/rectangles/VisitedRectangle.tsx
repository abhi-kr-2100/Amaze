import { StyleSheet, View, ViewStyle } from "react-native";
import { RectangleProps } from "./common";

export default function VisitedRectangle({
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

const VISITED_BG_COLOR = "red";

const defaultStyle = StyleSheet.create({
  root: {
    backgroundColor: VISITED_BG_COLOR,
  },
});
