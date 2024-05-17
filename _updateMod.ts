const readmeContentOriginal = Deno.readTextFileSync("README.md");
const jsonStr = Deno.readTextFileSync("deno.jsonc");
const jsonConf = JSON.parse(jsonStr) as { version: string };

let readmeContent = readmeContentOriginal.replaceAll(
  /https:\/\/deno.land\/x\/logger@v[\d.]+\/logger.ts/g,
  `https://deno.land/x/logger@v${jsonConf.version}/logger.ts`,
).replaceAll(
  /version: "[\d.]+"/g,
  `version: "${jsonConf.version}"`,
);

// update current version in readme
if (readmeContent !== readmeContentOriginal) {
  Deno.writeTextFileSync("README.md", readmeContent);
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
