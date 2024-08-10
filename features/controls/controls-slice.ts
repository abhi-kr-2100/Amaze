import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchName } from "../search/common";

export interface ControlsState {
  selectedSearchAlgorithm: SearchName;
  isSearching: boolean;
}

const initialState: ControlsState = {
  selectedSearchAlgorithm: "DFS",
  isSearching: false,
};

const controlsSlice = createSlice({
  name: "controls",
  initialState,
  reducers: {
    searchAlgorithmChanged(state, action: PayloadAction<SearchName>) {
      state.selectedSearchAlgorithm = action.payload;
    },

    isSearchingStatusChanged(state, action: PayloadAction<boolean>) {
      state.isSearching = action.payload;
    },
  },
});

export const {
  searchAlgorithmChanged,
  isSearchingStatusChanged: isSearchingSet,
} = controlsSlice.actions;
export default controlsSlice.reducer;
