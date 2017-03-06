const Blueprint   = require('../../ember-cli/lib/models/blueprint');
const getFiles = Blueprint.prototype.files;

export default Blueprint.extend({
  description: '',

  availableOptions: [
    { name: 'source-dir', type: String, default: 'src', aliases: ['sd'] },
    { name: 'prefix', type: String, default: 'app', aliases: ['p'] }
  ],

  beforeInstall: function(options: any) {
    if (options.ignoredUpdateFiles && options.ignoredUpdateFiles.length > 0) {
      return Blueprint.ignoredUpdateFiles =
        Blueprint.ignoredUpdateFiles.concat(options.ignoredUpdateFiles);
    }
  },

  locals: function(options: any) {
    // Split/join with / not path.sep as reference to typings require forward slashes.
    const relativeRootPath = options.sourceDir.split('/').map(() => '..').join('/');

    return {
      sourceDir: options.sourceDir,
      relativeRootPath: relativeRootPath,
      ng4: options.ng4
    };
  },

  files: function() {
    let fileList = getFiles.call(this) as Array<string>;

    return fileList;
  },

  fileMapTokens: function (options: any) {
    // Return custom template variables here.
    return {
      __path__: () => {
        return options.locals.sourceDir;
      }
    };
  }
});
