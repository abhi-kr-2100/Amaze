import { StyleSheet, View, Text, ViewStyle } from "react-native";
import { RectangleProps } from "./common";

export default function TreasureRectangle({
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
    >
      <Text style={defaultStyle.text}>{TREASURE_REPRESENTATION}</Text>
    </View>
  );
}

const TREASURE_REPRESENTATION = "$";
const TREASURE_BG_COLOR = "#FF5700";
const TREASURE_COLOR = "gold";

const defaultStyle = StyleSheet.create({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: TREASURE_BG_COLOR,
  },

  text: {
    fontWeight: "bold",
    color: TREASURE_COLOR,
  },
});
