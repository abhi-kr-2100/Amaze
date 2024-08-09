import { useAppSelector } from "@/hooks/redux";
import { View, Text, StyleSheet } from "react-native";

export default function MazeScreen() {
  const rectangles = useAppSelector((state) => state.maze.rectangles);

  return (
    <View style={styles.maze}>
      {rectangles.map((row, r) => (
        <View style={styles.mazeRow} key={r}>
          {row.map((cell, c) => (
            <View style={styles.mazeRect} key={c}></View>
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
  mazeRect: {
    flex: 1,
    width: 10,
    height: 10,

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "black",
  },
});
