import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(dirname, '..')

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldExtractValuesFromUnion: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  core: {
    disableTelemetry: true,
  },
  viteFinal: async (viteConfig) => {
    // NOTE: We intentionally do NOT register `@tamagui/vite-plugin` here.
    // As of @tamagui/vite-plugin@1.144, the CJS build calls
    // `import.meta.resolve()` which Storybook (loading the plugin in CJS
    // context) cannot satisfy → "import_meta.resolve is not a function".
    //
    // Tamagui works without the plugin — the runtime handles styles. The
    // plugin is purely a build-time optimization (atomic CSS extraction)
    // and not required for a dev tool like Storybook. Production app
    // builds (web/native) should still use the plugin/babel preset.
    return mergeConfig(viteConfig, {
      resolve: {
        // Route React Native imports to react-native-web so RN primitives
        // render in the browser.
        alias: {
          'react-native': 'react-native-web',
        },
        // Allow .web.tsx / .web.ts to win over .native.* for the Storybook bundle.
        extensions: [
          '.web.tsx',
          '.web.ts',
          '.web.jsx',
          '.web.js',
          '.tsx',
          '.ts',
          '.jsx',
          '.js',
          '.mjs',
          '.json',
        ],
      },
      define: {
        // react-native-web reads this at runtime.
        __DEV__: JSON.stringify(true),
        'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV ?? 'development'
        ),
      },
      optimizeDeps: {
        // Pre-bundle Tamagui to keep dev start fast.
        include: ['tamagui', 'react-native-web'],
      },
    })
  },
}

export default config
