import { TouchableOpacity } from "react-native-gesture-handler";
import { RectangleName, RectangleToComponent } from "./rectangles/common";
import { StyleSheet, View } from "react-native";
import { createElement } from "react";
import { Coord2D } from "@/features/maze/common";

export default function Maze({
  maze,
  onRectPress,
  rectDimensions,
  style,
}: MazeProps) {
  return (
    <View style={style?.maze}>
      {maze.map((row, r) => (
        <View style={style?.mazeRow} key={r}>
          {row.map((cell, c) => (
            <TouchableOpacity onPress={() => onRectPress([r, c])} key={c}>
              {createElement(
                RectangleToComponent[cell],
                rectDimensions([r, c])
              )}
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}

export interface MazeProps {
  maze: RectangleName[][];
  onRectPress: (coord: Coord2D) => any;
  rectDimensions: (coord: Coord2D) => { height: number; width: number };
  style?: StyleSheet.NamedStyles<any>;
}
