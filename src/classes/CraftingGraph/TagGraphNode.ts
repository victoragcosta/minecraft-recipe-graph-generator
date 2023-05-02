import GraphAttributes from "../Graph/GraphAttributes";
import GraphNode from "../Graph/GraphNode";
import TaggedGraphEdge from "./TaggedGraphEdge";

class TagGraphNodeAttributes extends GraphAttributes {
  public declare data: {
    namespace: string;
    path: string;
    type: string;
    tag: `#${string}:${string}`;
  };

  constructor(tag: `#${string}:${string}`, type: string) {
    super({
      namespace: tag.split(":")[0].slice(1),
      path: tag.split(":")[1],
      type,
      tag,
    });
  }
}

export default class TagGraphNode extends GraphNode<TagGraphNodeAttributes> {
  constructor(tag: `#${string}:${string}`, tagType: string) {
    super({
      attributes: new TagGraphNodeAttributes(tag, tagType),
    });
  }

  public isTaggedWith(tag: `#${string}:${string}`): boolean {
    const tagNode = this.inboundEdge.find((e) => {
      if (!(e.attributes instanceof TaggedGraphEdge)) return false;
      if (!(e.startNode instanceof TagGraphNode)) return false;
      return e.startNode.attributes.data.tag === tag;
    });
    return tagNode !== undefined;
  }
}
