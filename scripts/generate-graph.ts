// https://github.com/JayHales/Minecraft-Crafting-Web/blob/master/app.ts

import { readdirSync, existsSync, readFileSync } from "fs";
import Graph from "../src/classes/Graph/Graph";
import TagGraphNode from "../src/classes/CraftingGraph/TagGraphNode";
import { TagFile } from "../src/types/minecraft_files.types";
import ItemGraphNode from "../src/classes/CraftingGraph/ItemGraphNode";

const generatedGraph = new Graph();

function loadJson(path: string): unknown {
  const contents = readFileSync(path, { encoding: "utf-8" });
  const json = JSON.parse(contents);
  return json;
}

function loadRecursively(folder: string, loader: (path: string)=>void) {
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

const tagTypesToAnalyze = [
  "blocks",
  "items",
  "fluids",
];
function loadTags(tagsFolder: string, namespace: string) {
  loadRecursively(tagsFolder, (path: string) => {
    // Get the type of tag
    const tagType = path.replace(`${tagsFolder}/`, "").split("/")[0];

    if (!tagTypesToAnalyze.includes(tagType)) return;

    // Cleans the path to what Minecraft uses
    const tagPath = path.replace(`${tagsFolder}/${tagType}/`, "").slice(0, -5);
    const tagNode = new TagGraphNode(`#${namespace}:${tagPath}`, tagType);
    generatedGraph.addNode(tagNode);

    // Loads file data with all references
    const json = loadJson(path) as TagFile;
    for (const value of json.values) {
      const itemNode = new ItemGraphNode(value as `${string}:${string}`, tagType);
      generatedGraph.addNode(itemNode);
      generatedGraph.addEdge({
        start: tagNode,
        end: itemNode,
        data: {
          type: "tag",
        },
      });
    }
  });
}

function loadModData(modFolder) {
  const dataPath = `${modFolder}/data`;
  const namespaces = readdirSync(dataPath);

  for (const namespace of namespaces) {
    const base = `${dataPath}/${namespace}`;
    loadTags(`${base}/tags`, namespace);
    // loadRecipes(`${base}/recipes`);
    // loadLootTables(`${base}/loot_tables`);
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
  console.dir(generatedGraph, {depth: 5});
}

main();
