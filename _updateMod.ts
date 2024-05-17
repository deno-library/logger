let readmeContent = Deno.readTextFileSync("README.md");

readmeContent = readmeContent.replaceAll(
  /https:\/\/deno.land\/x\/logger@v[\d.]+\/logger.ts/g,
  "jsr:@deno-lib/logger@0.1.0/logger",
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
