import GraphAttributes from "../Graph/GraphAttributes";
import GraphEdge, { GraphEdgeParams } from "../Graph/GraphEdge";

class TaggedGraphEdgeAttributes extends GraphAttributes {
  declare public data: {};

  constructor() {
    super();
  }
}

export type TaggedGraphEdgeParams = Omit<GraphEdgeParams, "attributes">;

export default class TaggedGraphEdge extends GraphEdge<TaggedGraphEdgeAttributes> {
  constructor(params: TaggedGraphEdgeParams) {
    super({
      ...params,
      attributes: {data:{}},
    })
  }
}