import mockFetch from "cross-fetch";
import reducer, { checkBlockStatus } from "./blocks";
import { Block } from "../types/Block";
import initialState from "./initialState";

jest.mock("cross-fetch");

const mockedFech: jest.Mock<unknown> = mockFetch as any;

describe("Reducers::Nodes", () => {
  const getInitialState = () => {
    return initialState().blocks;
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

  const blockB: Block = {
    id: 2,
    type: "block",
    attributes: {
      index: 2,
      timestamp: 1530679678,
      data: "data 2",
      "previous-hash": "123.abc",
      hash: "321.cba",
    },
    nodeUrl: "http://localhost:3002",
  };

  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = getInitialState();

    expect(reducer(undefined, action)).toEqual(expected);
  });

  it("should handle checkBlockStatus.pending", () => {
    const appState = {
      list: [blockA, blockB],
      loading: [],
    };
    const action = {
      type: checkBlockStatus.pending,
      meta: { arg: blockA.nodeUrl },
    };
    const expected = {
      list: [blockB],
      loading: [{ nodeUrl: blockA.nodeUrl }],
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle checkBlockStatus.fulfilled", () => {
    const appState = {
      list: [blockA],
      loading: [],
    };
    const action = {
      type: checkBlockStatus.fulfilled,
      meta: { arg: blockB.nodeUrl },
      payload: [blockB],
    };
    const expected = {
      list: [blockA, blockB],
      loading: [],
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle checkBlockStatus.rejected", () => {
    const appState = {
      list: [],
      loading: [{ nodeUrl: blockB.nodeUrl }],
    };
    const action = {
      type: checkBlockStatus.rejected,
      meta: { arg: blockA.nodeUrl },
    };
    const expected = {
      list: [],
      loading: [{ nodeUrl: blockB.nodeUrl }],
    };

    expect(reducer(appState, action)).toEqual(expected);
  });
});

describe("Actions::Nodes", () => {
  const dispatch = jest.fn();

  afterAll(() => {
    dispatch.mockClear();
    mockedFech.mockClear();
  });
  
  const block: Block = {
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

  it("should fetch the block status", async () => {
    mockedFech.mockReturnValueOnce(
      Promise.resolve({
        status: 200,
        json() {
          return Promise.resolve({data: [block]});
        },
      })
    );
    await checkBlockStatus(block.nodeUrl)(dispatch, () => {}, {});

    const expected = expect.arrayContaining([
      expect.objectContaining({
        type: checkBlockStatus.pending.type,
        meta: expect.objectContaining({ arg: block.nodeUrl }),
      }),
      expect.objectContaining({
        type: checkBlockStatus.fulfilled.type,
        meta: expect.objectContaining({ arg: block.nodeUrl }),
        payload: [block],
      }),
    ]);
    expect(dispatch.mock.calls.flat()).toEqual(expected);
  });

  it("should fail to fetch the node status", async () => {
    mockedFech.mockReturnValueOnce(Promise.reject(new Error("Network Error")));
    await checkBlockStatus(block.nodeUrl)(dispatch, () => {}, {});
    const expected = expect.arrayContaining([
      expect.objectContaining({
        type: checkBlockStatus.pending.type,
        meta: expect.objectContaining({ arg: block.nodeUrl }),
      }),
      expect.objectContaining({
        type: checkBlockStatus.rejected.type,
        meta: expect.objectContaining({ arg: block.nodeUrl }),
        error: expect.objectContaining({ message: "Network Error" }),
      }),
    ]);

    expect(dispatch.mock.calls.flat()).toEqual(expected);
  });
});
