/**
 * This is a minimal script to publish your package to "npm".
 * This is meant to be used as-is or customize as you see fit.
 *
 * This script is executed on "dist/path/to/library" as "cwd" by default.
 *
 * You might need to authenticate with NPM before running this script.
 */

import { readCachedProjectGraph } from '@nrwl/devkit';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import chalk from 'chalk';

function invariant(condition, message) {
  if (!condition) {
    console.error(chalk.bold.red(message));
    process.exit(1);
  }
}

// Executing publish script: node path/to/publish.mjs {name} --version {version} --tag {tag}
// Default "tag" to "next" so we won't publish the "latest" tag by accident.
const [, , name, version, tag = 'next'] = process.argv;
let publishVersion = version;
if (
  !publishVersion ||
  publishVersion === 'true' ||
  publishVersion === 'undefined'
) {
  const resp = await fetch(`https://registry.npmjs.org/${name}`);
  const json = await resp.json();
  const currentVersion = json?.['dist-tags']?.latest;
  if (!currentVersion) {
    throw 'can not get version';
  }
  /** @type {string[]} */
  const parts = currentVersion.split('.');
  parts[parts.length - 1] = +parts[parts.length - 1] + 1;
  publishVersion = parts.join('.');
}

// output github action env
// console.log(process.env);

// A simple SemVer validation to validate the version
const validVersion = /^\d+\.\d+\.\d+(-\w+\.\d+)?/;
invariant(
  publishVersion && validVersion.test(publishVersion),
  `No version provided or version did not match Semantic Versioning, expected: #.#.#-tag.# or #.#.#, got ${publishVersion}.`
);

const graph = readCachedProjectGraph();
const project = graph.nodes[name];

invariant(
  project,
  `Could not find project "${name}" in the workspace. Is the project.json configured correctly?`
);

const outputPath = project.data?.targets?.build?.options?.outputPath;
invariant(
  outputPath,
  `Could not find "build.options.outputPath" of project "${name}". Is project.json configured  correctly?`
);

process.chdir(outputPath);

// Updating the version in "package.json" before publishing
try {
  const json = JSON.parse(readFileSync(`package.json`).toString());
  if (tag !== 'latest') {
    const { GITHUB_RUN_NUMBER } = process.env;
    publishVersion = `${publishVersion}-next.${GITHUB_RUN_NUMBER}`;
  }
  json.version = publishVersion;
  writeFileSync(`package.json`, JSON.stringify(json, null, 2));
} catch (e) {
  console.error(
    chalk.bold.red(`Error reading package.json file from library build output.`)
  );
}

// Execute "npm publish" to publish
execSync(`npm publish --access public --tag ${tag}`);
