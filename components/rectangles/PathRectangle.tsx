import { StyleSheet, View, ViewStyle } from "react-native";
import { RectangleProps } from "./common";

export default function PathRectangle({
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

const PATH_BG_COLOR = "white";

const defaultStyle = StyleSheet.create({
  root: {
    backgroundColor: PATH_BG_COLOR,
  },
});
