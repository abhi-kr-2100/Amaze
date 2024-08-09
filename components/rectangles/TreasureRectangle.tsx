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
      <Text>{TREASURE_REPRESENTATION}</Text>
    </View>
  );
}

const TREASURE_REPRESENTATION = "$";

const defaultStyle = StyleSheet.create({
  root: {},
});
