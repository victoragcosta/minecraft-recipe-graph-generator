import {
  NoEdgeError,
  UnconnectedGraphEdgeError,
} from "./GraphErrors";

import GraphEdge from "./GraphEdge";

export type GraphNodeParams<D=unknown> = {
  data?: D,
}

export type GraphEdgeParams<D=unknown> = {
  node: GraphNode,
  direction: "in" | "out",
  weight?: number,
  data?: D,
}

export default class GraphNode<D=unknown> {
  protected _outboundEdge: GraphEdge[];
  protected _inboundEdge: GraphEdge[];
  public data: D;

  constructor(params: GraphNodeParams<D>) {
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

  public addEdge(params: GraphEdgeParams<D>) {
    // Assertions
    if (!params.node) {
      throw new UnconnectedGraphEdgeError();
    }

    // Default parameters
    if (params.weight === undefined || params.weight === null) {
      params.weight = 1;
    }

    const arr = params.direction === "in" ? this._inboundEdge : this._outboundEdge;
    arr.push(new GraphEdge({
      startNode: params.direction === "in" ? params.node : this,
      endNode: params.direction === "out" ? params.node : this,
      weight: params.weight,
      data: params.data,
    }));

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
