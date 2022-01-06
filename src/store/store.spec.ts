import { AnyAction, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { ThunkMiddleware } from "redux-thunk";
import nodesReducer, { checkNodeStatus, NodesState } from "../reducers/nodes";
import blocksReducer, {
  checkBlockStatus,
  BlocksState,
} from "../reducers/blocks";
import { Block } from "../types/Block";

describe("Store", () => {
  const nodes = {
    list: [
      { url: "a.com", online: false, name: "", loading: false },
      { url: "b.com", online: false, name: "", loading: false },
      { url: "c.com", online: false, name: "", loading: false },
      { url: "d.com", online: false, name: "", loading: false },
    ],
  };
  const blockA: Block = {
    id: 1,
    type: "block",
    attributes: {
      index: 1,
      timestamp: 1530679678,
      data: "data 1",
      "previous-hash": "abc.123",
      hash: "cba.321",
    },
    nodeUrl: "http://localhost:3000",
  };
  const blocks = {
    list: [blockA],
    loading: [],
  };

  let store: EnhancedStore<
    {
      nodes: NodesState;
      blocks: BlocksState;
    },
    AnyAction,
    [
      | ThunkMiddleware<{ nodes: NodesState }, AnyAction, null>
      | ThunkMiddleware<{ nodes: NodesState }, AnyAction, undefined>
    ]
  >;

  beforeAll(() => {
    store = configureStore({
      reducer: {
        nodes: nodesReducer,
        blocks: blocksReducer,
      },
      preloadedState: { nodes },
    });
  });
  afterAll(() => {});

  it("should display results when necessary data is provided", () => {
    const actions = [
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[0] },
        payload: { node_name: "alpha" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[1] },
        payload: { node_name: "beta" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[0] },
        payload: { node_name: "gamma" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[2] },
        payload: { node_name: "delta" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[1] },
        payload: { node_name: "epsilon" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[0] },
        payload: { node_name: "zeta" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[0] },
        payload: { node_name: "eta" },
      },
      {
        type: checkNodeStatus.fulfilled.type,
        meta: { arg: nodes.list[0] },
        payload: { node_name: "theta" },
      },
      {
        type: checkBlockStatus.fulfilled.type,
        meta: { arg: blockA.nodeUrl },
        payload: [blockA],
      },
    ];
    actions.forEach((action) => store.dispatch(action));

    const actual = store.getState();
    const nodesExpected = {
      list: [
        { url: "a.com", online: true, name: "theta", loading: false },
        { url: "b.com", online: true, name: "epsilon", loading: false },
        { url: "c.com", online: true, name: "delta", loading: false },
        { url: "d.com", online: false, name: "", loading: false },
      ],
    };

    expect(actual.nodes).toEqual(nodesExpected);

    const blocksExpected = {
      list: [blockA],
      loading: [],
    };

    expect(actual.blocks).toEqual(blocksExpected);
  });
});
