const { withDangerousMod, AndroidConfig } = require('@expo/config-plugins');

const fs = require('fs');
const path = require('path');

function generateKeepXml({ keep = [], discard = [], shrinkMode }) {
  const attrs = [];

  if (keep.length) {
    attrs.push(`tools:keep="${keep.join(',')}"`);
  }

  if (discard.length) {
    attrs.push(`tools:discard="${discard.join(',')}"`);
  }

  if (shrinkMode) {
    attrs.push(`tools:shrinkMode="${shrinkMode}"`);
  }

  return `<?xml version="1.0" encoding="utf-8"?>
<resources
    xmlns:tools="http://schemas.android.com/tools"
    ${attrs.join('\n    ')} />
`;
}

const withKeepResources = (config, props = {}) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      /* const packageName =
        AndroidConfig.Package.getPackage(config) || 'expo.keep.resources'; */

      const valuesDir = path.join(
        config.modRequest.platformProjectRoot,
        'app',
        'src',
        'main',
        'res',
        'values',
      );

      await fs.promises.mkdir(valuesDir, {
        recursive: true,
      });

      // La doc recomienda nombres únicos/globales
      // const fileName = `${packageName}.keep.xml`;
      const fileName = 'keep.xml';

      const filePath = path.join(valuesDir, fileName);

      const xml = generateKeepXml({
        keep: props.keep,
        discard: props.discard,
        shrinkMode: props.shrinkMode,
      });

      await fs.promises.writeFile(filePath, xml, 'utf8');

      return config;
    },
  ]);
};

module.exports = withKeepResources;
