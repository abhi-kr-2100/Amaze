import { createElement } from "react";
import { StyleSheet, View } from "react-native";
import { RectangleToComponent } from "@/features/maze/filling-strategies";
import { useAppSelector } from "@/hooks/redux";

export default function MazeScreen() {
  const rectangles = useAppSelector((state) => state.maze.rectangles);

  return (
    <View style={styles.maze}>
      {rectangles.map((row, r) => (
        <View style={styles.mazeRow} key={r}>
          {row.map((cell, c) => (
            <View key={c}>
              {createElement(RectangleToComponent[cell], {
                height: 32,
                width: 32,
              })}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  maze: {
    flex: 1,

    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    gap: 5,
  },
  mazeRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    gap: 5,
  },
});
