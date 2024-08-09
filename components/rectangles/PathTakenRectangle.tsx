import { StyleSheet, View, ViewStyle } from "react-native";
import { RectangleProps } from "./common";

export default function PathTakenRectangle({
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

const PATH_TAKEN_BG_COLOR = "green";

const defaultStyle = StyleSheet.create({
  root: {
    backgroundColor: PATH_TAKEN_BG_COLOR,
  },
});
