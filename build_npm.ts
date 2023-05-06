import { build, emptyDir } from "https://deno.land/x/dnt@0.34.0/mod.ts";
// check version here: https://www.npmjs.com/package/midjourney-discord-api
// deno run -A _build.ts 0.0.0;
// cd npm; npm publish;
if (!Deno.args[0]) {
  console.error("Missing version number");
  console.error("usage: deno run -A build_npm.ts 0.0.0");
  Deno.exit(-1);
}
async function buildDnt() {
  try {
    await emptyDir("./npm");
    await build({
      entryPoints: ["./mod.ts"],
      outDir: "./npm",
      shims: {
        deno: true,
      },
      compilerOptions: {
      },
      package: {
        name: "deno-logger",
        author:
          "zfx",
        license: "MIT",
        contributors: [],
        description: "deno-logger",
        keywords: [
          "logger",
        ],
        homepage: "https://github.com/deno-library/logger",
        version: Deno.args[0],
        repository: {
          type: "git",
          url: "git+https://github.com/deno-library/logger",
        },
        bugs: {
          url: "https://github.com/deno-library/logger/issues",
        },
      },
    });
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    const readme = Deno.readTextFileSync("README.md");
    Deno.writeTextFileSync("npm/README.md", readme);
  } catch (e) {
    console.error(e);
  }
}
buildDnt();
