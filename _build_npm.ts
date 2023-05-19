// dnt deps can not be moved to dev_deps.ts
import { build, emptyDir } from "https://deno.land/x/dnt@0.35.0/mod.ts";
import * as pc from "https://deno.land/std@0.188.0/fmt/colors.ts";
import { PackageJsonObject } from "https://deno.land/x/dnt@0.35.0/lib/types.ts";

async function buildDnt() {
  let version = Deno.args[0];
  const GITHUB_REF = Deno.env.get("GITHUB_REF");

  if (!version && GITHUB_REF) {
    // drop the ref/tag/ and the v prefix
    console.log(`GITHUB_REF values is ${pc.green(GITHUB_REF)}`);
    version = GITHUB_REF.replace(/^.+\/[vV]?/g, "");
  }

  if (!version) {
    console.error("Missing version number");
    console.error("usage: deno run -A _build_npm.ts 0.0.0");
    Deno.exit(-1);
  }
  // allow only semver string
  if (!version.match(/[\d]+\.[\d]+\.[\d]+/)) {
    console.error(
      `version number ${
        pc.green(version)
      } do not match Semantic Versioning syntax ${
        pc.green("major.minor.path")
      }`,
    );
    Deno.exit(-1);
  }

  const packageJson: PackageJsonObject = {
    name: "@denodnt/logger",
    author: "zfx",
    license: "MIT",
    contributors: [
      "fuxing Zhang <fuxing.zhang@qq.com> (https://github.com/fuxingZhang)",
      "Uriel Chemouni <uchemouni@gmail.com> (https://uriel.ovh/)",
    ],
    description: "deno logger available for deno and NPM",
    keywords: [
      "logger",
      "deno",
    ],
    private: false,
    homepage: "https://github.com/deno-library/logger",
    version,
    repository: {
      type: "git",
      url: "git+https://github.com/deno-library/logger",
    },
    bugs: {
      url: "https://github.com/deno-library/logger/issues",
    },
  };

  await emptyDir("./npm");
  await build({
    entryPoints: ["./mod.ts"],
    outDir: "./npm",
    shims: {
      deno: true,
    },
    compilerOptions: {},
    package: packageJson,
    // scriptModule: false,
  });
  Deno.copyFileSync("LICENSE", "npm/LICENSE");
  let readme = Deno.readTextFileSync("README.md");
  readme = readme.replaceAll(
    /https:\/\/deno.land\/x\/logger@v[0-9.]+\/(logger|mod)\.ts/g,
    "@denodnt/logger",
  );
  // readme = readme.replaceAll('https://deno.land/x/logger@v1.1.0/logger.ts', '@denodnt/logger')
  // readme = readme.replaceAll(
  //   "Deno / NodeJS colorful logger colorful logger",
  //   `Deno / NodeJS colorful logger colorful logger
  //
  // For Deno usage refer to [deno-logger doc](https://deno.land/x/logger@v${version})`,
  // );
  Deno.writeTextFileSync("npm/README.md", readme);
}
buildDnt();
