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
      <Text style={defaultStyle.text}>{AGENT_REPRESENTATION}</Text>
    </View>
  );
}

const AGENT_REPRESENTATION = "@";
const AGENT_BG_COLOR = "#00FF00";
const AGENT_COLOR = "blue";

const defaultStyle = StyleSheet.create({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: AGENT_BG_COLOR,
  },

  text: {
    fontWeight: "bold",
    color: AGENT_COLOR,
  },
});
