/* eslint-env node */
const ImportDependency = require('webpack/lib/dependencies/ImportDependency');
const InstrumentedImportDependencyTemplate = require('./instrumented-import-dependency-template');

/**
 * Webpack plugin to replace standard ImportDependencyTemplate with custom one
 * See InstrumentedImportDependencyTemplate for more info
 */

class InstrumentedImportDependencyTemplatePlugin {
  constructor(opts) {
    this.clientChunkModuleManifest = opts.clientChunkModuleManifest;
  }

  apply(compiler) {
    /**
     * The standard plugin is added on `compile`,
     * which sets the default value for `ImportDependency` in  the `dependencyTemplates` map.
     * `make` is the subsequent lifeycle method, so we can override this value here.
     */
    compiler.plugin('make', (compilation, done) => {
      if (this.clientChunkModuleManifest) {
        // server
        this.clientChunkModuleManifest.get().then(manifest => {
          compilation.dependencyTemplates.set(
            ImportDependency,
            new InstrumentedImportDependencyTemplate(manifest)
          );
          done();
        });
      } else {
        // client
        compilation.dependencyTemplates.set(
          ImportDependency,
          new InstrumentedImportDependencyTemplate()
        );
        done();
      }
    });
  }
}

module.exports = InstrumentedImportDependencyTemplatePlugin;
