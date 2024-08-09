import { createElement } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  RECTANGLE_NAMES,
  RectangleToComponent,
} from "@/components/rectangles/common";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { rectangleChanged } from "@/features/maze/maze-slice";

export default function MazeScreen() {
  const dispatch = useAppDispatch();
  const rectangles = useAppSelector((state) => state.maze.rectangles);

  const toggleRectAt = (r: number, c: number) => {
    const newRectIdx =
      (RECTANGLE_NAMES.findIndex((v) => v === rectangles[r][c]) + 1) %
      RECTANGLE_NAMES.length;
    const newRect = RECTANGLE_NAMES[newRectIdx];

    dispatch(
      rectangleChanged({
        coord: [r, c],
        newRect,
      })
    );
  };

  return (
    <View style={styles.maze}>
      {rectangles.map((row, r) => (
        <View style={styles.mazeRow} key={r}>
          {row.map((cell, c) => (
            <TouchableOpacity onPress={() => toggleRectAt(r, c)} key={c}>
              {createElement(RectangleToComponent[cell], {
                height: 32,
                width: 32,
              })}
            </TouchableOpacity>
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
