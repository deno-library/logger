// dnt deps can not be moved to dev_deps.ts
import { build, emptyDir } from "https://deno.land/x/dnt@0.35.0/mod.ts";
import * as pc from "https://deno.land/std@0.188.0/fmt/colors.ts";
// deno run -A _build.ts 0.0.0;
// cd npm; npm publish;
// initial version will be v1.1.0


interface PackageJsonPerson {
  name: string;
  email?: string;
  url?: string;
}

interface PackageJsonBugs {
  url?: string;
  email?: string;
}

interface PackageJsonObject {
  name: string;
  version: string;
  description?: string;
  keywords?: string[];
  homepage?: string;
  bugs?: PackageJsonBugs | string;
  license?: "MIT" | string | 'UNLICENSED' | 'SEE LICENSE IN <filename>';
  author?: PackageJsonPerson | string;
  contributors?: (PackageJsonPerson | string)[];
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
  let version = Deno.args[0] ;
  const GITHUB_REF = Deno.env.get('GITHUB_REF')

  if (!version && GITHUB_REF) {
    // drop the ref/tag/ and the v prefix
    console.log(`GITHUB_REF values is ${pc.green(GITHUB_REF)}`);
    version = GITHUB_REF.replace(/^.+\/[vV]?/g, '');
  }

  if (!version) {
    console.error("Missing version number");
    console.error("usage: deno run -A _build_npm.ts 0.0.0");
    Deno.exit(-1);
  }
  // allow only semver string
  if (!version.match(/[\d]+\.[\d]+\.[\d]+/)) {
    console.error(`version number ${pc.green(version)} do not match common version number major.minor.path`);
    Deno.exit(-1);
  }

  const packageJson: PackageJsonObject = {
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
    version,
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
      // scriptModule: false,
    });
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    let readme = Deno.readTextFileSync("README.md");
    readme = readme.replaceAll(/https:\/\/deno.land\/x\/logger@v[0-9.]+\/(logger|mod)\.ts/g, '@denodnt/logger')
    // readme = readme.replaceAll('https://deno.land/x/logger@v1.1.0/logger.ts', '@denodnt/logger')
    readme = readme.replaceAll('logger for deno', `* [![NPM Version](https://img.shields.io/npm/v/@denodnt/logger.svg?style=flat)](https://www.npmjs.org/package/@denodnt/logger) Deno / NodeJS colorful logger colorful logger

For Deno usage refer to [deno-logger doc](https://deno.land/x/logger@v${version})`)
    Deno.writeTextFileSync("npm/README.md", readme);
  } catch (e) {
    console.error(e);
  }
}
buildDnt();
