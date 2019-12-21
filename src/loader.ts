import { promises as fsPromises } from 'fs';
import { loader } from 'webpack';
import path, { join as pathJoin } from 'path';
import { parse as parseYaml } from 'yaml';
import createCodegenOpts from './create-codegen-opts';
import { getTsxBaseDir } from './dirs';
import { processCodegen } from './process-codegen';
import { ConfigTypes } from './types';
import rimraf from 'rimraf';
import { DEFAULT_CONFIG_FILENAME } from './consts';

const tsxBaseDir = getTsxBaseDir();
rimraf.sync(tsxBaseDir);

const { readFile } = fsPromises;
const graphlqCodegenLoader: loader.Loader = function(gqlContent) {
  // const options = getOptions(this) || {};
  const callback = this.async()!;
  const { resourcePath: gqlFullPath, rootContext: userDir } = this;

  const configPath = pathJoin(userDir, DEFAULT_CONFIG_FILENAME);

  const gqlRelPath = path.relative(userDir, gqlFullPath);
  const tsxRelPath = `${gqlRelPath}.tsx`;
  const tsxFullPath = path.join(tsxBaseDir, tsxRelPath);
  const dtsFullPath = `${gqlFullPath}.d.ts`;

  (async () => {
    const config = parseYaml(
      await readFile(configPath, 'utf-8'),
    ) as ConfigTypes;

    const codegenOpts = await createCodegenOpts(config, userDir);

    // Pretend .tsx for later loaders.
    // babel-loader at least doesn't respond the .graphql extension.
    this.resourcePath = `${gqlFullPath}.tsx`;

    try {
      const tsxContent = await processCodegen(
        gqlContent.toString(),
        gqlFullPath,
        tsxFullPath,
        dtsFullPath,
        config,
        codegenOpts,
      );
      callback(undefined, tsxContent);
    } catch (e) {
      callback(e);
    }
  })();
};

export default graphlqCodegenLoader;