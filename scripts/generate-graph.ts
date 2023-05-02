// https://github.com/JayHales/Minecraft-Crafting-Web/blob/master/app.ts

import { readdirSync, existsSync, readFileSync } from "fs";
import TagGraphNode from "../src/classes/CraftingGraph/TagGraphNode";
import { TagFile } from "../src/types/minecraft_files.types";
import ItemGraphNode from "../src/classes/CraftingGraph/ItemGraphNode";
import CraftingGraph from "../src/classes/CraftingGraph/CraftingGraph";
import TaggedGraphEdge from "../src/classes/CraftingGraph/TaggedGraphEdge";

const generatedGraph = new CraftingGraph();

function loadJson(path: string): unknown {
  const contents = readFileSync(path, { encoding: "utf-8" });
  const json = JSON.parse(contents);
  return json;
}

function loadRecursively(folder: string, loader: (path: string) => void) {
  if (!existsSync(folder)) {
    return;
  }

  const recipeFolderItems = readdirSync(folder, { withFileTypes: true });
  for (const recipeFolderItem of recipeFolderItems) {
    const newFolder = `${folder}/${recipeFolderItem.name}`;
    if (recipeFolderItem.isDirectory()) {
      loadRecursively(newFolder, loader);
    } else if (recipeFolderItem.isFile()) {
      loader(newFolder);
    }
  }
}

const tagTypesToAnalyze = ["blocks", "items", "fluids"];
function loadTags(tagsFolder: string, namespace: string) {
  loadRecursively(tagsFolder, (path: string) => {
    // Get the type of tag
    const tagType = path.replace(`${tagsFolder}/`, "").split("/")[0];

    if (!tagTypesToAnalyze.includes(tagType)) return;

    // Cleans the path to what Minecraft uses
    const tagPath = path.replace(`${tagsFolder}/${tagType}/`, "").slice(0, -5);
    const tag: `#${string}:${string}` = `#${namespace}:${tagPath}`;
    let tagNode = generatedGraph.findTag(tag);
    if (tagNode === null) {
      tagNode = new TagGraphNode(tag, tagType);
      generatedGraph.addNode(tagNode);
    }

    // Loads file data with all references
    const json = loadJson(path) as TagFile;
    for (const value of json.values) {
      let item = value as `${string}:${string}`;
      if (typeof value !== "string") {
        item = value.id;
      }
      let itemNode = generatedGraph.findItem(item);
      if (itemNode === null) {
        itemNode = new ItemGraphNode(item, tagType);
        generatedGraph.addNode(itemNode);
      }
      if (!itemNode.isTaggedWith(tag)) {
        generatedGraph.addEdge(
          new TaggedGraphEdge({
            startNode: tagNode,
            endNode: itemNode,
          })
        );
      }
    }
  });
}

function loadModData(modFolder) {
  const dataPath = `${modFolder}/data`;
  const namespaces = readdirSync(dataPath);

  const tasks = [
    { func: loadTags, addedPath: "tags" },
    // { func: loadRecipes, addedPath: "recipes" },
    // { func: loadLootTables, addedPath: "loot_tables" },
  ];

  for (const task of tasks) {
    for (const namespace of namespaces) {
      const base = `${dataPath}/${namespace}`;
      task.func(`${base}/${task.addedPath}`, namespace);
    }
  }
}

function main() {
  const baseDirectory = process.cwd();
  const modsDataFolder = `${baseDirectory}/extract-data`;

  const modFolders = readdirSync(modsDataFolder);

  for (const modFolder of modFolders) {
    // console.log(`${modsDataFolder}/${modFolder}`);
    loadModData(`${modsDataFolder}/${modFolder}`);
  }
  console.dir(generatedGraph, { depth: 5 });
}

main();
