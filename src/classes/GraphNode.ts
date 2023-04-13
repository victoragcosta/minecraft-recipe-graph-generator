
export type GraphNodeParams = {
  data?: unknown,
}

export type GraphEdge = {
  data?: unknown,
  weight: number,
  startNode: GraphNode,
  endNode: GraphNode,
}

export type GraphEdgeParams = {
  node: GraphNode,
  direction: "in" | "out",
  weight?: number,
  data?: unknown,
}

export class UnconnectedGraphEdgeError extends Error {
  constructor() {
    super(`Unconnected Graph Error: graph edge lacks a node`);
  }
}
export class NoEdgeError extends Error {
  constructor() {
    super(`No Edge Error: this node doesn't have an edge to this node.`);
  }
}

export default class GraphNode {
  private _outboundEdge: GraphEdge[];
  private _inboundEdge: GraphEdge[];
  public data: unknown;

  constructor(params: GraphNodeParams) {
    this.data = params.data;
    this._inboundEdge = [];
    this._outboundEdge = [];
  }

  public get outboundEdge() : GraphEdge[] {
    return this._outboundEdge;
  }
  public get inboundEdge() : GraphEdge[] {
    return this._inboundEdge;
  }

  public addEdge(params: GraphEdgeParams) {
    // Assertions
    if (!params.node) {
      throw new UnconnectedGraphEdgeError();
    }

    // Default parameters
    if (params.weight === undefined || params.weight === null) {
      params.weight = 1;
    }

    const arr = params.direction === "in" ? this._inboundEdge : this._outboundEdge;
    arr.push({
      startNode: this,
      endNode: params.node,
      weight: params.weight,
      data: params.data,
    });

    return arr.at(-1);
  }
  public removeEdge(node: GraphNode, direction: "in" | "out"): GraphEdge {
    const arr = direction === "in" ? this._inboundEdge : this._outboundEdge;

    const edgeIndex = arr.findIndex(({ endNode: n }) => n === node);

    // Assertions
    if (edgeIndex === -1) {
      throw new NoEdgeError();
    }

    const edge = arr[edgeIndex];
    arr.splice(edgeIndex, 1);
    return edge;
  }
}
