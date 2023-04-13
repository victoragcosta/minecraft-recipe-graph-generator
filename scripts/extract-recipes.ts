import { readdirSync } from "fs";
import type { PathLike } from "fs";
import { exec } from "child_process";

function listJarFiles(jarPath: PathLike): Promise<string> {
  return new Promise((res, rej) => {
    const extraCommand = "";
    exec(`jar -tf "${jarPath}"${extraCommand}`, { maxBuffer: 1024 * 1024 * 50 }, (error, stdout, stderr) => {
      if (error) {
        rej(error);
        return;
      }
      if (stderr) {
        rej(stderr);
        return;
      }
      res(stdout);
    });
  });
}

function extractJarFiles(jarPath: PathLike, paths: PathLike[]): Promise<string> {
  return new Promise(async (res, rej) => {
    const items = paths.map((p) => `"${p}"`).join(" ");

    exec(`jar -xf "${jarPath}" ${items}`, { maxBuffer: 1024 * 1024 * 50 }, (error, stdout, stderr) => {
      if (error) {
        rej(error);
        return;
      }
      if (stderr) {
        rej(stderr);
        return;
      }
      res(stdout);
    });
  });
}

function filterRecipesFolders(files: string): Set<string> {
  const regex = /data\/[^/]*\/(?:tags|recipes|loot_tables)\//g;
  return new Set(files.match(regex));
}

async function main() {
  try {
    const jarsPath = "./jars";
    const files: string[] = readdirSync(jarsPath)
      .filter((f) => /.*\.jar/.test(f));
    console.log(
      `Found ${files.length} ${files.length !== 1 ? "files" : "file"}`
    );
    for (const file of files) {
      const jarPath = `${jarsPath}/${file}`;
      const jarOutput = await listJarFiles(jarPath);
      const result = filterRecipesFolders(jarOutput);
      if (result.size > 0) {
        await extractJarFiles(jarPath, [...result]);
      }
      console.log(`Extracted: ${file}`);
    }
  } catch (err) {
    console.error(err);
  }
}

main();
