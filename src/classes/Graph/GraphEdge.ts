import { indent } from "../../utils";
import GraphAttributes from "./GraphAttributes";
import GraphNode from "./GraphNode";

export type GraphEdgeParams<A extends GraphAttributes = GraphAttributes> = {
  attributes?: A;
  startNode: GraphNode;
  endNode: GraphNode;
};

let edgeCounter = 0;

export default class GraphEdge<A extends GraphAttributes = GraphAttributes> {
  public attributes?: A;
  public startNode: GraphNode;
  public endNode: GraphNode;
  private _id: number;

  constructor(params: GraphEdgeParams<A>) {
    this.attributes = params.attributes;
    this.startNode = params.startNode;
    this.endNode = params.endNode;
    this._id = edgeCounter++;
  }

  get id(): number {
    return this._id;
  }

  public toGraphMl() {
    const edgeXml = (innerXml: string) =>
      `<edge id="e${this._id}" source="n${this.startNode.id}" target="n${this.endNode.id}">\n` +
      `${indent(innerXml)}\n` +
      `</edge>`;
    return edgeXml(this.attributes.toGraphMl());
  }
}
