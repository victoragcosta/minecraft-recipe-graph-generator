import {
  NodeNotFoundError,
  EdgeNotFoundError,
  InconsistentGraphError,
} from "./GraphErrors";
import GraphNode from "./GraphNode";
import GraphEdge from "./GraphEdge";
import { indent } from "../../utils";

type OutboundInboundGraphEdge = {
  outbound: GraphEdge;
  inbound: GraphEdge;
};

export default class Graph {
  private _nodeList: GraphNode[];

  constructor() {
    this._nodeList = [];
  }

  /**
   * Finds a node in the graph via reference.
   * @param node The reference to a node that is in the graph.
   * @returns The exact same node
   * @throws NodeNotFoundError
   */
  protected findNode(node: GraphNode): GraphNode {
    const foundNode = this._nodeList.find((n) => n === node);

    if (!foundNode) {
      throw new NodeNotFoundError();
    }

    return foundNode;
  }
  /**
   * Finds a edge in the graph via reference.
   * @param edge The reference to a edge that is in the graph.
   * @returns The outbound and inbound edges in an object.
   * @throws EdgeNotFoundError
   * @throws InconsistentGraphError
   */
  protected findEdge(edge: GraphEdge): OutboundInboundGraphEdge {
    try {
      const startNode = this.findNode(edge.startNode);
      const endNode = this.findNode(edge.endNode);

      const foundEdge = startNode.outboundEdge.find((e) => e === edge);
      const foundReverseEdge = endNode.inboundEdge.find((e) => e === edge);

      if (!foundEdge && !foundReverseEdge) {
        throw new EdgeNotFoundError();
      } else if (!foundEdge) {
        throw new InconsistentGraphError(
          "there's the outbound but not the inbound edge in the graph."
        );
      } else if (!foundReverseEdge) {
        throw new InconsistentGraphError(
          "there's the inbound edge but not the outbound edge in the graph"
        );
      }

      return {
        outbound: foundEdge,
        inbound: foundReverseEdge,
      };
    } catch (err) {
      if (err instanceof NodeNotFoundError) {
        throw new EdgeNotFoundError();
      }
      throw err;
    }
  }

  public get nodeList(): GraphNode[] {
    return this._nodeList;
  }

  /**
   * Adds a node to this instance of Graph.
   * @param node The instantiated node to be added.
   */
  public addNode(node: GraphNode) {
    this._nodeList.push(node);
  }
  /**
   * Removes a node and all its edges from the graph.
   * @param node The reference to a node that exists in the graph.
   * @returns The removed node.
   * @throws NodeNotFoundError
   */
  public removeNode(node: GraphNode): GraphNode {
    // Check to see if there is the node. Will throw an error if not.
    const foundNode = this.findNode(node);

    // Remove all edges
    for (const edge of foundNode.outboundEdge) {
      edge.endNode.removeEdge(foundNode, "in");
    }
    for (const edge of foundNode.inboundEdge) {
      edge.startNode.removeEdge(foundNode, "out");
    }

    // Remove the node from the graph
    this._nodeList.splice(this._nodeList.indexOf(foundNode), 1);
    return foundNode;
  }

  /**
   * Adds a directed edge to this instance of Graph.
   * @param edge The instantiated edge that references only nodes in this graph.
   * @throws NodeNotFoundError
   */
  public addEdge(edge: GraphEdge) {
    // Check to see if there are the nodes. Will throw an error if not.
    const foundStart = this.findNode(edge.startNode);
    const foundEnd = this.findNode(edge.endNode);

    // Add reverse reference to edge
    foundEnd.addEdge(edge);
    // Add edge
    foundStart.addEdge(edge);
  }
  /**
   * Removes an specific edge from this instance of Graph.
   * @param edge The reference to an existing outbound edge in this graph.
   * @returns The removed edge.
   * @throws EdgeNotFoundError
   * @throws InconsistentGraphError
   */
  public removeEdge(edge: GraphEdge): GraphEdge {
    // Check if there's an edge
    const { outbound, inbound } = this.findEdge(edge);

    // Remove edge in both directions
    outbound.startNode.removeEdge(outbound.endNode, "out");
    inbound.endNode.removeEdge(inbound.startNode, "in");

    return outbound;
  }

  public toGraphMl() {
    const rootTag = (innerXml) =>
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<graphml\n` +
      `  xmlns="http://graphml.graphdrawing.org/xmlns"\n` +
      `  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n` +
      `  xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd"\n` +
      `>\n` +
      `${indent(innerXml)}\n` +
      `</graphml>`;
    const graphTag = (innerXml) =>
      `<graph id="G" edgedefault="directed">\n` +
      `${indent(innerXml)}\n` +
      `</graph>`;

    const nodeAttributesDefinition = [
      ...new Set(
        this._nodeList
          .map((n) => n.attributes.toGraphMlDefinition("node"))
          .reduce((p, c) => p.concat(c), [])
      ),
    ];
    const edgeAttributesDefinition = [
      ...new Set(
        this._nodeList
          .map((n) =>
            n.outboundEdge
              .map((e) => e.attributes.toGraphMlDefinition("edge"))
              .reduce((p, c) => p.concat(c), [])
          )
          .reduce((p, c) => p.concat(c))
      ),
    ];

    const nodesXml = this._nodeList.map((n) => n.toGraphMl()).join("\n");
    const edgesXml = this._nodeList
      .map((n) => n.outboundEdge.map((e) => e.toGraphMl()))
      .reduce((p, c) => p.concat(c))
      .join("\n");

    return rootTag(
      nodeAttributesDefinition.join("\n") +
        "\n" +
        edgeAttributesDefinition.join("\n") +
        "\n" +
        graphTag(nodesXml + "\n" + edgesXml)
    );
  }
}
