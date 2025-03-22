import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import DashboardModel, {
  ageObjectColors,
  EnrichedTransaction,
  TimeRangeTab,
  Transaction,
  UtmAgeDemographicData,
  UtmAgeDemographicLink,
  utmColors,
} from "../../models/DashboardModel";
import { generateUUID } from "../../utils/number";

type ProcessDataType = {
  transactions: Transaction[];
  timeRange: TimeRangeTab;
};

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
    initProcess: (
      state,
      action: PayloadAction<{ processData: ProcessDataType }>
    ) => {
      state.processLoading = true;
      const timeRange = action.payload.processData.timeRange;
      const transactions = action.payload.processData.transactions;
      const { end, start, prevEnd, prevStart } =
        DashboardModel.getDateRange(timeRange);

      const enrichedTransaction: EnrichedTransaction[] =
        DashboardModel.getEnrichedTransactions(transactions);

      const currentTransactions = enrichedTransaction.filter(
        (transaction: EnrichedTransaction) => {
          return (
            transaction.transaction_time >= start &&
            transaction.transaction_time <= end
          );
        }
      );
      const utm_sources = DashboardModel.getUTMSources(currentTransactions);

      const utmSourcesNodes = utm_sources.map((item) => {
        return {
          id: item,
          name: item.charAt(0).toUpperCase() + item.slice(1),
          color: utmColors[item].nodeColor,
        };
      });

      const enrichedTransactions = transactions.map((transaction) => ({
        ...transaction,
        age_group: DashboardModel.calculateAgeGroup(
          transaction.customer_metadata.birthday_time,
          transaction.transaction_time
        ),
      }));

      const links: UtmAgeDemographicLink[] = enrichedTransactions.map(
        (transaction: EnrichedTransaction) => {
          return {
            source: transaction.utm_source,
            target: transaction.age_group,
            value: transaction.revenue_usd,
            color: utmColors[transaction.utm_source].linkColor,
          };
        }
      );
      state.processLoading = false;
      // state.ageGroupData = {
      //   nodes: [...utmSourcesNodes, ...ageObjectColors],
      //   links,
      // };
    },
  },
});

export const ageGroupActions = ageGroupSlice.actions;

//export const selectCount = (state: RootState) => state.counter.value

export default ageGroupSlice.reducer;
