// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');
const { getBundleModeMetroConfig } = require("react-native-worklets/bundleMode");
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
let config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('sql');

// Enable react-native-worklets's Bundle Mode
config = getBundleModeMetroConfig(config);

// Uniwind
config = withUniwindConfig(config, {  
  cssEntryFile: './global.css',
  dtsFile: './uniwind-types.d.ts',
});

// Resolve conflics
const uniwindDir = path.dirname(require.resolve('uniwind/package.json')) + path.sep;
const realReactNativePath = require.resolve('react-native');
const wrappedResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === 'react-native' &&
    typeof context.originModulePath === 'string' &&
    context.originModulePath.startsWith(uniwindDir)
  ) {
    return {
      type: 'sourceFile',
      filePath: realReactNativePath,
    };
  }
  return (wrappedResolveRequest || context.resolveRequest)(context, moduleName, platform);
}

module.exports = config;
