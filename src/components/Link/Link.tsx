import { styled, Text, type GetProps } from 'tamagui'
import { forwardRef } from 'react'

/**
 * Link — renders a real <a href> on web (crawlable by search engines)
 * and a Text with onPress on native.
 *
 * The `href` prop is forwarded to the underlying <a> on web.
 * On native, consumers should wire `onPress` to navigation / Linking.openURL.
 */
const StyledLink = styled(Text, {
  name: 'Link',
  tag: 'a',
  cursor: 'pointer',
  color: '$primary',

  hoverStyle: {
    color: '$primaryHover',
    textDecorationLine: 'underline',
  },

  variants: {
    variant: {
      inline: {
        textDecorationLine: 'underline',
      },
      standalone: {
        textDecorationLine: 'none',
      },
    },
  } as const,

  defaultVariants: {
    variant: 'standalone',
  },
})

type StyledLinkProps = GetProps<typeof StyledLink>

export type LinkProps = StyledLinkProps & {
  href: string
  external?: boolean
}

export const Link = forwardRef<unknown, LinkProps>(function Link(
  { href, external, ...props },
  ref,
) {
  return (
    <StyledLink
      ref={ref as never}
      // Web-only props — RN ignores unknown DOM props at runtime,
      // and Tamagui's tag='a' makes these effective on the web build.
      {...({
        href,
        target: external ? '_blank' : undefined,
        rel: external ? 'noopener noreferrer' : undefined,
      } as object)}
      {...props}
    />
  )
})
