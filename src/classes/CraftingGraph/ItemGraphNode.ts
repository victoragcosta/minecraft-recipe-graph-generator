import GraphAttributes from "../Graph/GraphAttributes";
import GraphNode from "../Graph/GraphNode";
import TagGraphNode from "./TagGraphNode";
import TaggedGraphEdge from "./TaggedGraphEdge";

class ItemGraphNodeAttributes extends GraphAttributes {
  public declare data: {
    namespace: string;
    path: string;
    type: string;
    item: `${string}:${string}`;
  };

  constructor(item: `${string}:${string}`, type: string) {
    super({
      namespace: item.split(":")[0],
      path: item.split(":")[1],
      type: type,
      item: item,
    });
  }
}

export default class ItemGraphNode extends GraphNode<ItemGraphNodeAttributes> {
  constructor(item: `${string}:${string}`, itemType: string) {
    super({
      attributes: new ItemGraphNodeAttributes(item, itemType),
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
