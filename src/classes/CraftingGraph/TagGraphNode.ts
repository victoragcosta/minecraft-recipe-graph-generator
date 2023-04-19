import GraphNode from "../Graph/GraphNode";

export default class TagGraphNode extends GraphNode {
  constructor(tag: `#${string}:${string}`, tagType: string) {
    super({
      data: {
        namespace: tag.split(":")[0].slice(1),
        path: tag.split(":")[1],
        type: tagType,
        tag,
      },
    })
  }
}
