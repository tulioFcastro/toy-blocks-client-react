import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetch from "cross-fetch";
import { RootState } from "../store/configureStore";
import { Block } from "../types/Block";
import initialState from "./initialState";

export interface BlocksState {
  list: Block[];
  loading: { nodeUrl: string }[];
}

export const checkBlockStatus = createAsyncThunk(
  "blocks/checkBlockStatus",
  async (url: string) => {
    const response = await fetch(`${url}/api/v1/blocks`);
    const { data } = await response.json();
    return data;
  }
);

export const blocksSlice = createSlice({
  name: "blocks",
  initialState: initialState().blocks as BlocksState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(checkBlockStatus.pending, (state, action) => {
      state.list = state.list.filter((b) => b.nodeUrl !== action.meta.arg);
      state.loading.push({ nodeUrl: action.meta.arg });
    });
    builder.addCase(checkBlockStatus.fulfilled, (state, action) => {
      const newBlocks = action.payload?.map(
        (block: any) => ({ ...block, nodeUrl: action.meta.arg } as Block)
      );
      newBlocks.forEach((block: Block) => {
        state.list.push(block);
      });

      state.loading = state.loading.filter(
        (l) => l.nodeUrl !== action.meta.arg
      );
    });
    builder.addCase(checkBlockStatus.rejected, (state, action) => {
      state.loading = state.loading.filter(
        (l) => l.nodeUrl !== action.meta.arg
      );
    });
  },
});

export const selectAllBlocks = (state: RootState) => state.blocks.list;

export const selectAllLoadingBlocks = (state: RootState) =>
  state.blocks.loading;

export default blocksSlice.reducer;
