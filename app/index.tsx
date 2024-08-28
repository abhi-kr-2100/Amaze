import Controls from "@/components/Controls";
import Maze from "@/components/Maze";
import { searchingStatusChanged } from "@/features/controls/controls-slice";
import { Coord2D, findRects } from "@/features/maze/common";
import {
  historicalRectsCleared,
  rectangleChanged,
  rectanglesChanged,
} from "@/features/maze/maze-slice";
import { SearchNameToSearch } from "@/features/search/common";
import { InvalidAgentOrTreasureCountError } from "@/features/search/errors";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import useDimensions from "@/hooks/useDimensions";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function MazeScreen() {
  const { height: winHeight, width: winWidth, wp, hp } = useDimensions();
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

  const [error, setError] = useState<string | null>(null);
  const dismissError = () => {
    setError(null);
  };

  useEffect(() => {
    if (!isSearching) {
      return;
    }

    const performSearch = () => {
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

      return diffs;
    };

    try {
      dispatch(historicalRectsCleared());
      const diffs = performSearch();
      dispatch(rectanglesChanged(diffs));
    } catch (err) {
      if (err instanceof InvalidAgentOrTreasureCountError) {
        setError(
          "Error: There must be exactly 1 agent and 1 treasure on the maze."
        );
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      dispatch(searchingStatusChanged(false));
    }
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
          height: winMode === "Portrait" ? hp(3) : wp(3),
          width: winMode === "Portrait" ? hp(3) : wp(3),
        })}
        style={styles}
      />
      <Controls />
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={dismissError}>
            <FontAwesome name="close" size={20} color="white" />
          </Pressable>
        </View>
      )}
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

    backgroundColor: "grey",
    padding: 5,
    borderRadius: 5,
  },
  mazeRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "red",
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "white",
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
});
