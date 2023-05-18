import { build, emptyDir } from "./dev_deps.ts";
// check version here: https://www.npmjs.com/package/midjourney-discord-api
// deno run -A _build.ts 0.0.0;
// cd npm; npm publish;
// initial version will be v1.1.0
if (!Deno.args[0]) {
  console.error("Missing version number");
  console.error("usage: deno run -A _build_npm.ts 0.0.0");
  Deno.exit(-1);
}

type SPDXLicenseIdentifier = "MIT" | string; // could be more specific if you enumerate all valid SPDX identifiers.

interface Person {
  name: string;
  email?: string;
  url?: string;
}

interface Bugs {
  url?: string;
  email?: string;
}

interface PackageJson {
  name: string;
  version: string;
  description?: string;
  keywords?: string[];
  homepage?: string;
  bugs?: Bugs | string;
  license?: SPDXLicenseIdentifier | 'UNLICENSED' | 'SEE LICENSE IN <filename>';
  author?: Person | string;
  contributors?: (Person | string)[];
  main?: string;
  types?: string;
  scripts?: { [key: string]: string };
  repository?: { type: string, url: string };
  dependencies?: { [packageName: string]: string };
  devDependencies?: { [packageName: string]: string };
  peerDependencies?: { [packageName: string]: string };
  bundleDependencies?: { [packageName: string]: string };
  optionalDependencies?: { [packageName: string]: string };
  engines?: { [engineName: string]: string };
  os?: string[];
  cpu?: string[];
  private?: boolean;
  /**
   * rest of the fields
   */
  // deno-lint-ignore no-explicit-any
  [propertyName: string]: any;
}

async function buildDnt() {
  const packageJson: PackageJson = {
    name: "@denodnt/logger",
    author:
      "zfx",
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
    version: Deno.args[0],
    repository: {
      type: "git",
      url: "git+https://github.com/deno-library/logger",
    },
    bugs: {
      url: "https://github.com/deno-library/logger/issues",
    },
  };

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
      package: packageJson,
    });
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    let readme = Deno.readTextFileSync("README.md");
    readme = readme.replaceAll('https://deno.land/x/logger@v1.1.0/logger.ts', '@denodnt/logger')
    readme = readme.replaceAll('logger for deno', '* [![NPM Version](https://img.shields.io/npm/v/@denodnt/logger.svg?style=flat)](https://www.npmjs.org/package/@denodnt/logger) deno / nodeJS colorful logger')
    Deno.writeTextFileSync("npm/README.md", readme);
  } catch (e) {
    console.error(e);
  }
}
buildDnt();
