import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import nodesReducer from "../reducers/nodes";
import blocksReducer from "../reducers/blocks";

export const store = configureStore({
  reducer: {
    nodes: nodesReducer,
    blocks: blocksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
