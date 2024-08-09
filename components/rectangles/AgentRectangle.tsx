import { StyleSheet, View, Text, ViewStyle } from "react-native";
import { RectangleProps } from "./common";

export default function AgentRectangle({
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
      <Text>{AGENT_REPRESENTATION}</Text>
    </View>
  );
}

const AGENT_REPRESENTATION = "@";

const defaultStyle = StyleSheet.create({
  root: {},
});
