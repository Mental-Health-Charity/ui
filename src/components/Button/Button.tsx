import { styled, Stack, Text } from 'tamagui'

/**
 * Button — renders a real <button> on web (focusable, keyboard, screen reader)
 * and a Pressable-like Stack on native.
 *
 * Color variants map to semantic tokens from themes.ts.
 */
const ButtonFrame = styled(Stack, {
  name: 'Button',
  tag: 'button',
  role: 'button',
  cursor: 'pointer',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  gap: 8,
  borderWidth: 1,
  borderColor: 'transparent',
  borderRadius: 8,
  paddingHorizontal: 16,
  paddingVertical: 10,
  userSelect: 'none',

  pressStyle: { opacity: 0.85 },
  focusStyle: {
    outlineStyle: 'solid',
    outlineWidth: 2,
    outlineColor: '$borderColorFocus',
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
        hoverStyle: { backgroundColor: '$primaryHover' },
        pressStyle: { backgroundColor: '$primaryPress' },
      },
      secondary: {
        backgroundColor: '$secondary',
        hoverStyle: { backgroundColor: '$secondaryHover' },
        pressStyle: { backgroundColor: '$secondaryPress' },
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: '$borderColor',
        hoverStyle: { backgroundColor: '$backgroundHover', borderColor: '$borderColorHover' },
      },
      ghost: {
        backgroundColor: 'transparent',
        hoverStyle: { backgroundColor: '$backgroundHover' },
      },
      softPrimary: {
        backgroundColor: '$primarySoft',
        hoverStyle: { backgroundColor: '$primaryLightest' },
      },
      softSecondary: {
        backgroundColor: '$secondarySoft',
        hoverStyle: { backgroundColor: '$secondaryLightest' },
      },
      danger: {
        backgroundColor: '$danger',
        hoverStyle: { backgroundColor: '$dangerHover' },
        pressStyle: { backgroundColor: '$dangerPress' },
      },
      softDanger: {
        backgroundColor: '$dangerSoft',
        hoverStyle: { backgroundColor: '$redLightest' },
      },
    },

    size: {
      sm: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
      md: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
      lg: { paddingHorizontal: 20, paddingVertical: 14, borderRadius: 10 },
    },

    disabled: {
      true: {
        opacity: 0.5,
        pointerEvents: 'none',
        cursor: 'not-allowed',
      },
    },

    fullWidth: {
      true: { alignSelf: 'stretch' },
    },
  } as const,

  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

const ButtonText = styled(Text, {
  name: 'ButtonText',
  fontFamily: '$body',
  fontWeight: '500', // Sarabun Medium ("semibold" per Figma convention)

  variants: {
    variant: {
      primary: { color: '$primaryText' },
      secondary: { color: '$secondaryText' },
      outline: { color: '$color' },
      ghost: { color: '$color' },
      softPrimary: { color: '$primaryTextSoft' },
      softSecondary: { color: '$secondaryTextSoft' },
      danger: { color: '$dangerText' },
      softDanger: { color: '$dangerTextSoft' },
    },
    size: {
      // Map to Figma scales: sm→small (14/20), md→regular (16/21), lg→large (18/23)
      sm: { fontSize: 14, lineHeight: 20 },
      md: { fontSize: 16, lineHeight: 21 },
      lg: { fontSize: 18, lineHeight: 23 },
    },
  } as const,
})

export const Button = ButtonFrame.styleable<{
  children?: React.ReactNode
}>(({ children, ...props }, ref) => {
  // Wrap raw string children in ButtonText so typography and color match the variant.
  return (
    <ButtonFrame ref={ref} {...props}>
      {typeof children === 'string' ? (
        <ButtonText variant={props.variant} size={props.size}>
          {children}
        </ButtonText>
      ) : (
        children
      )}
    </ButtonFrame>
  )
})

export { ButtonText }
export type ButtonProps = React.ComponentProps<typeof Button>
