import CraftingGraph from "../../src/classes/CraftingGraph/CraftingGraph";
import ItemGraphNode from "../../src/classes/CraftingGraph/ItemGraphNode";
import TagGraphNode from "../../src/classes/CraftingGraph/TagGraphNode";
import TaggedGraphEdge from "../../src/classes/CraftingGraph/TaggedGraphEdge";
import { TagFile } from "../../src/types/minecraft_files.types";
import { loadJson, loadRecursively } from "./load-helpers";

const tagTypesToAnalyze = ["blocks", "items", "fluids"];

export function loadTags(
  graph: CraftingGraph,
  tagsFolder: string,
  namespace: string
) {
  loadRecursively(tagsFolder, (path: string) => {
    // Get the type of tag
    const tagType = path.replace(`${tagsFolder}/`, "").split("/")[0];

    if (!tagTypesToAnalyze.includes(tagType)) return;

    // Cleans the path to what Minecraft uses
    const tagPath = path.replace(`${tagsFolder}/${tagType}/`, "").slice(0, -5);
    const tag: `#${string}:${string}` = `#${namespace}:${tagPath}`;
    let tagNode = graph.findTag(tag);
    if (tagNode === null) {
      tagNode = new TagGraphNode(tag, tagType);
      graph.addNode(tagNode);
    }

    // Loads file data with all references
    const json = loadJson(path) as TagFile;
    for (const value of json.values) {
      let item = value as `${string}:${string}`;
      if (typeof value !== "string") {
        item = value.id;
      }
      let itemNode = graph.findItem(item);
      if (itemNode === null) {
        itemNode = new ItemGraphNode(item, tagType);
        graph.addNode(itemNode);
      }
      if (!itemNode.isTaggedWith(tag)) {
        graph.addEdge(
          new TaggedGraphEdge({
            startNode: tagNode,
            endNode: itemNode,
          })
        );
      }
    }
  });
}
