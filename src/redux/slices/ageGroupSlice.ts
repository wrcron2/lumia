import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { Transaction } from "../../models/DashboardModel";

// Define a type for the slice state
export interface AgeGroupState {
  processLoading: boolean;
  processError: string;
  // transactions: Transaction[];
}

// Define the initial state using that type
const initialState: AgeGroupState = {
  processLoading: false,
  processError: "",
};

export const ageGroupSlice = createSlice({
  name: "counter",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    initProcess: (state) => {},
  },
});

export const {} = ageGroupSlice.actions;

//export const selectCount = (state: RootState) => state.counter.value

export default ageGroupSlice.reducer;
