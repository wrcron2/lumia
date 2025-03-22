import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Transaction,
  UtmAgeDemographicData,
} from "../../models/DashboardModel";
import { generateUUID } from "../../utils/number";

export interface AgeGroupState {
  processLoading: boolean;
  processError: string;
  transactions: Transaction[];
  ageGroupData: UtmAgeDemographicData;
  updateKey: string;
}

// Define the initial state using that type
const initialState: AgeGroupState = {
  processLoading: false,
  processError: "",
  transactions: [],
  ageGroupData: { links: [], nodes: [] },
  updateKey: "",
};

export const ageGroupSlice = createSlice({
  name: "ageGroup",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.processLoading = action.payload;
      if (action.payload === false) {
        state.updateKey = generateUUID();
      }
    },
    updateGraph: (state) => {
      state.updateKey = generateUUID();
    },
  },
});

export const ageGroupActions = ageGroupSlice.actions;

//export const selectCount = (state: RootState) => state.counter.value

export default ageGroupSlice.reducer;
