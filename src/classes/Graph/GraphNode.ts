import {
  NoEdgeError,
  UnconnectedGraphEdgeError,
  UnownedGraphEdgeError,
} from "./GraphErrors";

import GraphEdge from "./GraphEdge";
import GraphAttributes from "./GraphAttributes";

export type GraphNodeParams<A extends GraphAttributes = GraphAttributes> = {
  attributes?: A,
}

export default class GraphNode<A extends GraphAttributes = GraphAttributes> {
  protected _outboundEdge: GraphEdge[];
  protected _inboundEdge: GraphEdge[];
  public attributes: A;

  constructor(params: GraphNodeParams<A>) {
    this.attributes = params.attributes;
    this._inboundEdge = [];
    this._outboundEdge = [];
  }

  public get outboundEdge() : GraphEdge[] {
    return this._outboundEdge;
  }
  public get inboundEdge() : GraphEdge[] {
    return this._inboundEdge;
  }

  public addEdge(edge: GraphEdge) {
    // Assertions
    if (!edge.startNode || !edge.endNode) {
      throw new UnconnectedGraphEdgeError();
    }

    if (edge.startNode !== this && edge.endNode !== this) {
      throw new UnownedGraphEdgeError();
    }

    const arr = edge.endNode === this ? this._inboundEdge : this._outboundEdge;
    arr.push(edge);
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

  public removeEdgeByReference(edge: GraphEdge) {
    const arr = this._inboundEdge.concat(this._outboundEdge);
    const edgeIndex = arr.findIndex((e) => e === edge);

    // Assertions
    if (edgeIndex === -1) {
      throw new NoEdgeError();
    }

    arr.splice(edgeIndex, 1);
  }
}
