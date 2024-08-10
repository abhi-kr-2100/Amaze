import {
  searchAlgorithmChanged,
  searchingStatusChanged,
} from "@/features/controls/controls-slice";
import { SearchNameToFriendlyName } from "@/features/search/common";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Button, StyleSheet, Text, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";

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

const styles = StyleSheet.create({
  root: {
    display: "flex",
    gap: 10,
  },
});
