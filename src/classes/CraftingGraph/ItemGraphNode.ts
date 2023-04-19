import GraphNode from "../Graph/GraphNode";

export default class ItemGraphNode extends GraphNode {
  constructor(item: `${string}:${string}`, itemType: string) {
    super({
      data: {
        namespace: item.split(":")[0],
        path: item.split(":")[1],
        type: itemType,
        item,
      },
    })
  }
}
