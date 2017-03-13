import * as path from 'path';
import * as webpack from 'webpack';

import { BuildTaskOptions } from '../commands/build';
import { getWebpackStatsConfig } from '../models/webpack-configs/utils';
import { getWebpackConfig } from '../utilities/config-utils';
import { CliConfig } from '../models/config';

const fs = require('fs');
const Task = require('../ember-cli/lib/models/task');


export default Task.extend({
  run: function (runTaskOptions: BuildTaskOptions) {
    const project = this.cliProject;
    const webpackConfig: any[] = getWebpackConfig(runTaskOptions, project);

    const webpackCompiler = webpack(webpackConfig);
    const statsConfig = getWebpackStatsConfig(runTaskOptions.verbose);

    return new Promise((resolve, reject) => {
      const callback: webpack.compiler.CompilerCallback = (err, stats) => {
        if (err) {
          return reject(err);
        }

        this.ui.writeLine(stats.toString(statsConfig));

        if (runTaskOptions.watch) {
          return;
        }

        if (!runTaskOptions.watch && runTaskOptions.statsJson) {
          const jsonStats = stats.toJson('verbose');

          fs.writeFileSync(
            path.resolve(
              project.root, CliConfig.fromProject().config.apps[0].outDir, 'stats.json'
            ),
            JSON.stringify(jsonStats, null, 2)
          );
        }

        if (stats.hasErrors()) {
          reject();
        } else {
          resolve();
        }
      };

      if (runTaskOptions.watch) {
        webpackCompiler.watch({ poll: runTaskOptions.poll }, callback);
      } else {
        webpackCompiler.run(callback);
      }
    })
    .catch((err: Error) => {
      if (err) {
        this.ui.writeError('\nAn error occured during the build:\n' + ((err && err.stack) || err));
      }
      throw err;
    });
  }
});
