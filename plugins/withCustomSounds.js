const { withDangerousMod } = require('@expo/config-plugins');

const fs = require('fs');
const path = require('path');

const withCustomSounds = (config, props) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const root = config.modRequest.projectRoot;

      const rawDir = path.join(root, 'android/app/src/main/res/raw');

      fs.mkdirSync(rawDir, { recursive: true });

      for (const soundPath of props.sounds ?? []) {
        const absolutePath = path.join(root, soundPath);

        const fileName = path
          .basename(soundPath)
          .toLowerCase()
          .replace(/[^a-z0-9_.]/g, '_');

        fs.copyFileSync(absolutePath, path.join(rawDir, fileName));
      }

      return config;
    },
  ]);
};

module.exports = withCustomSounds;
