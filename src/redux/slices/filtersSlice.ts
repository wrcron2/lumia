import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filters: {
    UTMSource: [],
    AgeGroup: [],
    Revenue: [],
    DateRange: [],

  },
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    updateSearchTerm: (state, action) => {
    },
  },
});
export const { updateSearchTerm } = filtersSlice.actions;

export default filtersSlice.reducer;
