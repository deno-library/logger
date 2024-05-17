let readmeContent = Deno.readTextFileSync("README.md");
const jsonConf = JSON.parse(Deno.readTextFileSync("deno.jsonc")) as {version: string};

const readmeContent2 = readmeContent.replaceAll(
  /https:\/\/deno.land\/x\/logger@v[\d.]+\/logger.ts/g,
  `https://deno.land/x/logger@v${jsonConf.version}/logger.ts`,
).replaceAll(
  /version: "[\d.]+"/g,
  `version: "${jsonConf.version}"`,
);

// update current version in readme
if (readmeContent !== readmeContent2) {
  Deno.writeTextFileSync("README.md", readmeContent2);
}

readmeContent = readmeContent.replaceAll(
  /https:\/\/deno.land\/x\/logger@v[\d.]+\/logger.ts/g,
  `jsr:@deno-lib/logger@${jsonConf.version}/logger`,
);

// Write the updated content back to the mod.ts file
Deno.writeTextFileSync(
  "mod.ts",
  `/**
* ${readmeContent}
* @module
*/

/**
* The Logger class
*/
export { default as Logger } from "./logger.ts";
/**
* The Logger class default instance
*/
export { default as default } from "./logger.ts";
`,
);
