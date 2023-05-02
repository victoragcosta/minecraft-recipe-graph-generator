import GraphAttributes from "./GraphAttributes";
import GraphNode from "./GraphNode";

export type GraphEdgeParams<A extends GraphAttributes = GraphAttributes> = {
  attributes?: A,
  startNode: GraphNode,
  endNode: GraphNode,
}

export default class GraphEdge<A extends GraphAttributes = GraphAttributes> {
  public attributes?: A;
  public startNode: GraphNode;
  public endNode: GraphNode;

  constructor(params: GraphEdgeParams<A>) {
    this.attributes = params.attributes;
    this.startNode = params.startNode;
    this.endNode = params.endNode;
  }
}
