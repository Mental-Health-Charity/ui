import type { Preview, Decorator } from '@storybook/react-vite'
import React from 'react'
import { PeryskopProvider } from '../src/config/Provider'
import { palette } from '../src/tokens/palette'
import './preview.css'

const themeDecorator: Decorator = (Story, context) => {
  const theme: 'light' | 'dark' =
    context.globals.theme === 'dark' ? 'dark' : 'light'

  return (
    <PeryskopProvider defaultTheme={theme}>
      <div
        data-theme={theme}
        style={{
          minHeight: '100vh',
          padding: 24,
          background:
            theme === 'dark' ? palette.ink.darkest : palette.common.white,
          color:
            theme === 'dark' ? palette.sky.lightest : palette.ink.darkest,
        }}
      >
        <Story />
      </div>
    </PeryskopProvider>
  )
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Run axe-core on every story; surface violations in the a11y panel.
      element: '#storybook-root',
      config: {},
      options: {},
    },
    layout: 'padded',
    options: {
      storySort: {
        order: [
          'Foundations',
          ['Colors', 'Typography', 'Spacing', 'Radius', 'Shadows'],
          'Components',
          ['Button', 'Link', 'Layout'],
        ],
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Active Peryskop theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [themeDecorator],
}

export default preview
