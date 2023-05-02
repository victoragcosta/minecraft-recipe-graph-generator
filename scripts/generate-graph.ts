// https://github.com/JayHales/Minecraft-Crafting-Web/blob/master/app.ts

import { readdirSync, writeFileSync } from "fs";
import CraftingGraph from "../src/classes/CraftingGraph/CraftingGraph";
import { loadTags } from "./generate-graph/load-tags";
import ItemGraphNode from "../src/classes/CraftingGraph/ItemGraphNode";
import TagGraphNode from "../src/classes/CraftingGraph/TagGraphNode";

const generatedGraph = new CraftingGraph();

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
      task.func(generatedGraph, `${base}/${task.addedPath}`, namespace);
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

  const tags = generatedGraph.nodeList.filter((n) => n instanceof TagGraphNode);
  const items = generatedGraph.nodeList.filter(
    (n) => n instanceof ItemGraphNode
  );
  console.log(`${tags.length} tags and ${items.length} items`);

  writeFileSync(
    "./generatedGraph.graphml",
    generatedGraph.toGraphMl(),
    "utf-8"
  );
}

main();
