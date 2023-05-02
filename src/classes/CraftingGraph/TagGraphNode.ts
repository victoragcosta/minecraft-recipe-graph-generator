import GraphAttributes from "../Graph/GraphAttributes";
import GraphNode from "../Graph/GraphNode";

class TagGraphNodeAttributes extends GraphAttributes {
  declare public data: {
    namespace: string,
    path: string,
    type: string,
    tag: `#${string}:${string}`,
  };

  constructor(tag: `#${string}:${string}`, type: string,) {
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
    })
  }
}
