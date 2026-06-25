// Re-export Tamagui primitives so consumers can `import { XStack, YStack, Text } from '@peryskop/ui'`
// instead of pulling them straight from 'tamagui'. Keeps the dependency surface explicit.
export {
  TamaguiProvider,
  Stack,
  XStack,
  YStack,
  ZStack,
  Text,
  View,
  styled,
  useTheme,
  useMedia,
  type GetProps,
  type TamaguiProviderProps,
} from 'tamagui'

export * from './config'
export * from './tokens'
export * from './components'
