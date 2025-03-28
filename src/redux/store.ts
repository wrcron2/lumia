import { configureStore } from "@reduxjs/toolkit";
// ...
import ageGroupReducer from "./slices/ageGroupSlice";
import filtersReducer from "./slices/filtersSlice";
export const store = configureStore({
  reducer: {
    ageGroup: ageGroupReducer,
    filters: filtersReducer,
    // attribution: attributionReducer,
    // revTrend: revTrendReducer,
  },
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
