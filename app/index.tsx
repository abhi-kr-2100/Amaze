import Controls from "@/components/Controls";
import Maze from "@/components/Maze";
import { searchingStatusChanged } from "@/features/controls/controls-slice";
import { Coord2D, findRects } from "@/features/maze/common";
import {
  rectangleChanged,
  rectanglesChanged,
} from "@/features/maze/maze-slice";
import { SearchNameToSearch } from "@/features/search/common";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import useDimensions from "@/hooks/useDimensions";
import { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";

export default function MazeScreen() {
  const { height: winHeight, width: winWidth, wp } = useDimensions();
  const winMode: "Landscape" | "Portrait" =
    winHeight > winWidth ? "Portrait" : "Landscape";

  const dispatch = useAppDispatch();

  const maze = useAppSelector((state) => state.maze.rectangles);
  const selectedRectName = useAppSelector(
    (state) => state.controls.selectedRectName
  );

  const searchAlgorithmName = useAppSelector(
    (state) => state.controls.selectedSearchAlgorithm
  );
  const isSearching = useAppSelector((state) => state.controls.isSearching);

  const agents = useMemo(() => findRects(maze, "Agent"), [maze]);
  const treasures = useMemo(() => findRects(maze, "Treasure"), [maze]);

  useEffect(() => {
    if (!isSearching) {
      return;
    }

    const search = new SearchNameToSearch[searchAlgorithmName](
      maze,
      agents,
      treasures
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

  const setRectAt = ([r, c]: Coord2D) => {
    const newRect = selectedRectName;

    dispatch(
      rectangleChanged({
        coord: [r, c],
        newRect,
      })
    );
  };

  return (
    <View
      style={[
        styles.container,
        winMode == "Landscape"
          ? styles.containerLandscape
          : styles.containerPortrait,
      ]}
    >
      <Maze
        maze={maze}
        onRectPress={setRectAt}
        rectDimensions={() => ({
          height: wp(3),
          width: wp(3),
        })}
        style={styles}
      />
      <Controls />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    gap: 5,
    padding: 10,
  },
  containerLandscape: {
    flexDirection: "row",
  },
  containerPortrait: {
    flexDirection: "column",
  },
  maze: {
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
