import Controls from "@/components/Controls";
import Maze from "@/components/Maze";
import { RECTANGLE_NAMES } from "@/components/rectangles/common";
import { searchingStatusChanged } from "@/features/controls/controls-slice";
import { Coord2D } from "@/features/maze/common";
import {
  rectangleChanged,
  rectanglesChanged,
} from "@/features/maze/maze-slice";
import { SearchNameToSearch } from "@/features/search/common";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

export default function MazeScreen() {
  const dispatch = useAppDispatch();

  const maze = useAppSelector((state) => state.maze.rectangles);

  const searchAlgorithmName = useAppSelector(
    (state) => state.controls.selectedSearchAlgorithm
  );
  const isSearching = useAppSelector((state) => state.controls.isSearching);

  useEffect(() => {
    if (!isSearching) {
      return;
    }

    const search = new SearchNameToSearch[searchAlgorithmName](
      maze,
      [[maze.length - 1, 0]],
      [[0, maze[0].length - 1]]
    );

    let diffs = [];

    let i = 0;
    for (var diff of search) {
      ++i;

      diffs.push(...diff);

      if (i >= 10000) {
        break;
      }
    }

    dispatch(searchingStatusChanged(false));
    dispatch(rectanglesChanged(diffs));
  }, [isSearching]);

  const toggleRectAt = ([r, c]: Coord2D) => {
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
      <Maze
        maze={maze}
        onRectPress={toggleRectAt}
        rectDimensions={() => ({
          height: 32,
          width: 32,
        })}
        style={styles}
      />
      <Controls />
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
