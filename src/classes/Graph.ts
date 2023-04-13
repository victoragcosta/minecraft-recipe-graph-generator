import GraphNode, { GraphEdge } from "./GraphNode";

export type AddEdgeParams = {
  start: GraphNode,
  end: GraphNode,
  weight?: number,
  data?: unknown,
}

export class NodeNotFoundError extends Error {
  constructor() {
    super("Node Not Found: the specified node was not found inside the graph.");
  }
}

export default class Graph {
  private _nodeList: GraphNode[];

  constructor() {
    this._nodeList = [];
  }

  public get nodeList(): GraphNode[] {
    return this._nodeList;
  }

  public addNode(node: GraphNode) {
    this._nodeList.push(node);
  }
  public removeNode(node: GraphNode) {
    throw new Error("Method not implemented");
  }

  public addEdge(params: AddEdgeParams) {
    throw new Error("Method not implemented");

    const foundStart = this._nodeList.find(n => n === params.start);
    const foundEnd = this._nodeList.find(n => n === params.end);

    if (!foundStart || !foundEnd) {
      throw new NodeNotFoundError();
    }

    foundStart.addEdge({
      node: foundEnd,
      direction: "out",
      weight: params.weight,
      data: params.data,
    });
    foundEnd.addEdge({
      node: foundStart,
      direction: "out",
      weight: params.weight,
      data: params.data,
    });
  }
  public removeEdge(edge: GraphEdge) {
    throw new Error("Method not implemented");
  }
}
