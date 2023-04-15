// https://github.com/JayHales/Minecraft-Crafting-Web/blob/master/app.ts

import { readdirSync, existsSync } from "fs";

function loadRecursively(recipeFolder: string, loader: (path: string)=>void) {
  if (!existsSync(recipeFolder)) {
    return;
  }

  const recipeFolderItems = readdirSync(recipeFolder, { withFileTypes: true });
  for (const recipeFolderItem of recipeFolderItems) {
    if (recipeFolderItem.isDirectory()) {
      loadRecursively(`${recipeFolder}/${recipeFolderItem.name}`, loader);
    } else if (recipeFolderItem.isFile()) {
      loader(`${recipeFolder}/${recipeFolderItem.name}`);
    }
  }
}

function loadModData(modFolder) {
  const dataPath = `${modFolder}/data`;
  const modIds = readdirSync(dataPath);

  for (const modId of modIds) {
    // loadRecipes(`${dataPath}/${modId}/recipes`);
    // loadTags(`${modId}/tags`);
    // loadLootTables(`${modId}/loot_tables`);
  }
}

function main() {
  const baseDirectory = process.cwd();
  const modsDataFolder = `${baseDirectory}/extract-data`;

  const modFolders = readdirSync(modsDataFolder);

  for (const modFolder of modFolders) {
    console.log(`${modsDataFolder}/${modFolder}`);
    loadModData(`${modsDataFolder}/${modFolder}`);
  }
}

main();
