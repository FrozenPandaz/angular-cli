import { BuildTaskOptions } from '../commands/build';
import { NgCliWebpackConfig } from '../models/webpack-config';
import { CliConfig } from '../models/config';
const SilentError = require('silent-error');
import * as rimraf from 'rimraf';
import * as path from 'path';

export function getWebpackConfig(runTaskOptions: BuildTaskOptions, project: any) {
  const config = CliConfig.fromProject().config;
  const webpackConfig: any[] = [];

  config.apps.forEach((appConfig: any) => {
    const outputPath = runTaskOptions.outputPath || appConfig.outDir;

    if (project.root === outputPath) {
      throw new SilentError('Output path MUST not be project root directory!');
    }
    if (config.project && config.project.ejected) {
      throw new SilentError('An ejected project cannot use the build command anymore.');
    }
    rimraf.sync(path.resolve(project.root, outputPath));

    webpackConfig.push(new NgCliWebpackConfig(runTaskOptions, appConfig).buildConfig());
  });

  return webpackConfig;
}
