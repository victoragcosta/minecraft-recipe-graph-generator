import { readdirSync, existsSync, readFileSync } from "fs";

export function loadJson(path: string): unknown {
  const contents = readFileSync(path, { encoding: "utf-8" });
  const json = JSON.parse(contents);
  return json;
}

export function loadRecursively(
  folder: string,
  loader: (path: string) => void
) {
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
