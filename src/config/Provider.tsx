import { TamaguiProvider, type TamaguiProviderProps } from 'tamagui'
import { tamaguiConfig } from './tamagui.config'

type PeryskopProviderProps = Omit<TamaguiProviderProps, 'config'> & {
  config?: TamaguiProviderProps['config']
}

export function PeryskopProvider({
  children,
  config,
  ...props
}: PeryskopProviderProps) {
  return (
    <TamaguiProvider config={config ?? tamaguiConfig} {...props}>
      {children}
    </TamaguiProvider>
  )
}
