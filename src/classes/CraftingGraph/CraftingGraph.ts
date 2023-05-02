import Graph from "../Graph/Graph";
import ItemGraphNode from "./ItemGraphNode";
import TagGraphNode from "./TagGraphNode";

export type TagReference = Record<string, ItemGraphNode[]>;

export default class CraftingGraph extends Graph {
  public findTag(tag: `#${string}:${string}`): TagGraphNode | null {
    const node = this.nodeList.find((n)=>{
      if(!(n instanceof TagGraphNode)) return false;
      return n.attributes.data.tag === tag;
    });
    if(!node) return null;
    return node as TagGraphNode;
  }
  public findItem(item: `${string}:${string}`): ItemGraphNode | null {
    const node = this.nodeList.find((n)=>{
      if(!(n instanceof ItemGraphNode)) return false;
      return n.attributes.data.item === item;
    });
    if(!node) return null;
    return node as ItemGraphNode;
  }
}
