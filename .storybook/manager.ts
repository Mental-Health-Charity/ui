import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'

const peryskopTheme = create({
  base: 'light',
  brandTitle: 'Peryskop UI',
  brandTarget: '_self',
  colorPrimary: '#06b7a7',
  colorSecondary: '#06b7a7',
  fontBase: '"Sarabun", system-ui, -apple-system, sans-serif',
  fontCode: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
})

addons.setConfig({
  theme: peryskopTheme,
  sidebar: {
    showRoots: true,
  },
})
