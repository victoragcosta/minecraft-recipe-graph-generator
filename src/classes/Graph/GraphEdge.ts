import GraphNode from "./GraphNode";

export type GraphEdgeParams = {
  data?: unknown,
  weight: number,
  startNode: GraphNode,
  endNode: GraphNode,
}

export default class GraphEdge {
  public data?: unknown;
  public weight: number;
  public startNode: GraphNode;
  public endNode: GraphNode;

  constructor(params: GraphEdgeParams) {
    this.data = params.data;
    this.weight = params.weight;
    this.startNode = params.startNode;
    this.endNode = params.endNode;
  }
}
