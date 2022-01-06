export interface Block {
  id: string | number;
  type: string;
  attributes: {
    index: number;
    timestamp: number;
    data: string;
    "previous-hash": string;
    hash: string;
  };
  nodeUrl: string;
}
