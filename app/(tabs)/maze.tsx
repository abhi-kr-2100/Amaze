import { createElement, useEffect, useState } from "react";
import { Button, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  RECTANGLE_NAMES,
  RectangleToComponent,
} from "@/components/rectangles/common";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  rectangleChanged,
  rectanglesChanged,
} from "@/features/maze/maze-slice";
import DFSSearch from "@/features/search/DFSSearch";

export default function MazeScreen() {
  const dispatch = useAppDispatch();
  const maze = useAppSelector((state) => state.maze.rectangles);

  const [isSearching, setIsSearching] = useState(false);

  const dfs = new DFSSearch(
    maze,
    [[maze.length - 1, 0]],
    [[0, maze[0].length - 1]]
  );

  useEffect(() => {
    if (!isSearching) {
      return;
    }

    let diffs = [];

    let i = 0;
    for (var diff of dfs) {
      ++i;

      diffs.push(...diff);

      if (i >= 10000) {
        break;
      }
    }

    setIsSearching(false);
    dispatch(rectanglesChanged(diffs));
  }, [isSearching]);

  const toggleRectAt = (r: number, c: number) => {
    const newRectIdx =
      (RECTANGLE_NAMES.findIndex((v) => v === maze[r][c]) + 1) %
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
    <View style={styles.container}>
      <View style={styles.maze}>
        {maze.map((row, r) => (
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
      <Button title="Search!" onPress={() => setIsSearching(true)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,

    paddingHorizontal: 100,
  },
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
