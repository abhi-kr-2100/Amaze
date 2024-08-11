import {
  searchAlgorithmChanged,
  searchingStatusChanged,
  selectedRectNameChanged,
} from "@/features/controls/controls-slice";
import { SearchNameToFriendlyName } from "@/features/search/common";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Button, StyleSheet, Text, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { RECTANGLE_NAMES, RectangleToComponent } from "./rectangles/common";
import { createElement } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

const searchAlgorithms = Object.entries(SearchNameToFriendlyName).map(
  ([id, title]) => ({
    id,
    title,
  })
);

export default function Controls() {
  const dispatch = useAppDispatch();

  const selectedSearchAlgorithm = useAppSelector(
    (state) => state.controls.selectedSearchAlgorithm
  );
  const isSearching = useAppSelector((state) => state.controls.isSearching);

  return (
    <View style={styles.root}>
      <RectSelection />
      <SelectDropdown
        data={searchAlgorithms}
        onSelect={(item) => dispatch(searchAlgorithmChanged(item.id))}
        renderButton={() => (
          <View>
            <Text>{SearchNameToFriendlyName[selectedSearchAlgorithm]}</Text>
          </View>
        )}
        renderItem={(item) => <Text>{item.title}</Text>}
      />
      <Button
        title="Search!"
        onPress={() => dispatch(searchingStatusChanged(true))}
        disabled={isSearching}
      />
    </View>
  );
}

function RectSelection() {
  const dispatch = useAppDispatch();
  const selectedRectName = useAppSelector(
    (state) => state.controls.selectedRectName
  );

  return (
    <View style={styles.rectSelection}>
      {RECTANGLE_NAMES.map((r) => (
        <TouchableOpacity
          key={r}
          onPress={() => dispatch(selectedRectNameChanged(r))}
        >
          <View style={selectedRectName === r && styles.selectedRect}>
            {createElement(RectangleToComponent[r], {
              height: 28,
              width: 28,
            })}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    display: "flex",
    gap: 10,
  },
  rectSelection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  selectedRect: {
    borderWidth: 2,
    borderRadius: 5,
  },
});
