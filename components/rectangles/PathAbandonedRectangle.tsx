import { StyleSheet, View, ViewStyle } from "react-native";
import { RectangleProps } from "./common";

export default function PathAbandonedRectangle({
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

const PATH_ABANDONED_BG_COLOR = "red";

const defaultStyle = StyleSheet.create({
  root: {
    backgroundColor: PATH_ABANDONED_BG_COLOR,
  },
});
