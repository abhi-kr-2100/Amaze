import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchName } from "../search/common";
import { RectangleName } from "@/components/rectangles/common";

export interface ControlsState {
  selectedRectName: RectangleName;
  selectedSearchAlgorithm: SearchName;
  isSearching: boolean;
}

const initialState: ControlsState = {
  selectedRectName: "Path",
  selectedSearchAlgorithm: "DFS",
  isSearching: false,
};

const controlsSlice = createSlice({
  name: "controls",
  initialState,
  reducers: {
    selectedRectNameChanged(state, action: PayloadAction<RectangleName>) {
      state.selectedRectName = action.payload;
    },

    searchAlgorithmChanged(state, action: PayloadAction<SearchName>) {
      state.selectedSearchAlgorithm = action.payload;
    },

    searchingStatusChanged(state, action: PayloadAction<boolean>) {
      state.isSearching = action.payload;
    },
  },
});

export const {
  selectedRectNameChanged,
  searchAlgorithmChanged,
  searchingStatusChanged,
} = controlsSlice.actions;
export default controlsSlice.reducer;
