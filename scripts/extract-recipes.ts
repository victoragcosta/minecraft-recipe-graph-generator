import { readdirSync, rmSync, mkdirSync, existsSync } from "fs";
import type { PathLike } from "fs";
import { exec } from "child_process";

function createCleanDir(name: string) {
  const exists = existsSync(name);
  if (exists) {
    rmSync(name, { recursive: true, force: true });
  }
  mkdirSync(name);
}

function listJarFiles(jarPath: PathLike): Promise<string> {
  return new Promise((res, rej) => {
    const extraCommand = "";
    exec(
      `jar -tf "${jarPath}"${extraCommand}`,
      { maxBuffer: 1024 * 1024 * 50 },
      (error, stdout, stderr) => {
        if (error) {
          rej(error);
          return;
        }
        if (stderr) {
          rej(stderr);
          return;
        }
        res(stdout);
      }
    );
  });
}

function extractJarFiles(
  jarPath: PathLike,
  paths: PathLike[]
): Promise<string> {
  return new Promise(async (res, rej) => {
    const items = paths.map((p) => `"${p}"`).join(" ");

    exec(
      `jar -xf "${jarPath}" ${items}`,
      { maxBuffer: 1024 * 1024 * 50 },
      (error, stdout, stderr) => {
        if (error) {
          rej(error);
          return;
        }
        if (stderr) {
          rej(stderr);
          return;
        }
        res(stdout);
      }
    );
  });
}

function filterRecipesFolders(files: string): Set<string> {
  const regex =
    /(data\/[^/]*\/(?:tags|recipes|loot_tables)\/|assets\/[^/]*\/(?:lang|models|textures)\/)/g;
  return new Set(files.match(regex));
}

async function main() {
  try {
    const baseDirectory = process.cwd();
    const jarsPath = `${baseDirectory}/jars`;
    const extractFolder = `${baseDirectory}/extract-data`;

    // Clear the extraction folder
    createCleanDir(extractFolder);

    // Get all jar files names
    const files: string[] = readdirSync(jarsPath).filter((f) =>
      /.*\.jar/.test(f)
    );
    console.log(
      `Found ${files.length} ${files.length !== 1 ? "files" : "file"}`
    );

    // Extract each jar file
    for (const file of files) {
      const extractionPath = `${extractFolder}/${file.replace(/.jar$/, "")}`;
      const jarPath = `${jarsPath}/${file}`;
      // Get the files inside the jar
      const jarOutput = await listJarFiles(jarPath);
      // List only the relevant ones
      const relevantFiles = filterRecipesFolders(jarOutput);
      console.log([...relevantFiles]);
      // Extract if there is relevant data
      if (relevantFiles.size > 0) {
        mkdirSync(extractionPath);
        process.chdir(extractionPath);
        await extractJarFiles(jarPath, [...relevantFiles]);
        process.chdir(baseDirectory);
      }
      console.log(`Extracted: ${file}`);
    }
  } catch (err) {
    console.error(err);
  }
}

main();
