import GraphNode from "./GraphNode";

export default class GraphEdge {
  public data?: unknown;
  public weight: number;
  public startNode: GraphNode;
  public endNode: GraphNode;
}
