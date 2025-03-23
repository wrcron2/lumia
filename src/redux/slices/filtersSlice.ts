import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  TransactionFilters,
  RevenueRangeFilter,
} from "../../models/DashboardModel";

const initialState: TransactionFilters = {
  utms: [],
  gender: [],
  ageGroups: [],
  revenue: [],
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setUtmmFilter: (state, action: PayloadAction<string[]>) => {
      state.utms = action.payload;
    },
    setGenderFilter: (state, action: PayloadAction<string[]>) => {
      state.gender = action.payload;
    },
    setAgeGroupFilter: (state, action: PayloadAction<string[]>) => {
      state.ageGroups = action.payload;
    },
    setRevenueFilter: (state, action: PayloadAction<RevenueRangeFilter[]>) => {
      state.revenue = action.payload;
    },
  },
});
export const filtersActions = filtersSlice.actions;

export default filtersSlice.reducer;
