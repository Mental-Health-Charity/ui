import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'
import type { GetProps } from 'tamagui'
import { AvatarFrame, AvatarInitial, AvatarGroupFrame, getInitialFontSize } from './Avatar.styles'

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

type FrameProps = GetProps<typeof AvatarFrame>

export interface AvatarProps extends Omit<FrameProps, 'children' | 'ring'> {
  /** Image URL. When it loads successfully, replaces the fallback. */
  src?: string
  /**
   * Full name — used for the initials fallback ("Joe Doe" → "JD") and as
   * the default `aria-label` / image `alt`.
   */
  name?: string
  /**
   * Custom fallback ReactNode. Rendered instead of initials when the image
   * fails to load or `src` isn't provided.
   */
  fallback?: ReactNode
  /** Square edge length in px. Defaults to 32. */
  size?: number
  /** Applies a 2px ring in `$background` colour — used by `Avatar.Group`. */
  ring?: boolean
  /** Optional custom label for screen readers (overrides `name`). */
  'aria-label'?: string
}

interface AvatarComponent extends React.ForwardRefExoticComponent<
  AvatarProps & React.RefAttributes<HTMLSpanElement>
> {
  Group: typeof AvatarGroup
}

/**
 * Circular user / entity avatar with graceful fallback.
 *
 * Priority: `fallback` (if given) → image (`src` that loaded successfully)
 * → initials from `name` → empty circle.
 *
 * ```tsx
 * <Avatar src="/joe.jpg" name="Joe Doe" size={40} />
 * <Avatar name="Alice" />           // renders "A"
 * <Avatar fallback={<UserIcon />} /> // custom fallback
 * ```
 */
const AvatarBase = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, name, fallback, size = 32, ring = false, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  const [imageErrored, setImageErrored] = useState(false)
  const showImage = Boolean(src) && !imageErrored
  const label = ariaLabel ?? name

  return (
    <AvatarFrame
      ref={ref as never}
      width={size}
      height={size}
      ring={ring}
      role="img"
      aria-label={label}
      {...rest}
    >
      {showImage ? (
        // Plain <img> keeps things simple across platforms — on native the
        // consumer would swap this for `<Image>` from RN. For the web-first
        // scope of this library it's the pragmatic choice.
        <img
          src={src}
          alt={label ?? ''}
          onError={() => setImageErrored(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      ) : fallback !== undefined ? (
        fallback
      ) : (
        <AvatarInitial fontSize={getInitialFontSize(size)}>{getInitials(name)}</AvatarInitial>
      )}
    </AvatarFrame>
  )
})

/** "Joe Doe" → "JD" · "Alice" → "A" · "" → "" */
function getInitials(name: string | undefined): string {
  if (!name) return ''
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return (parts[0]?.[0] ?? '').toUpperCase()
  return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase()
}

// ---------------------------------------------------------------------------
// Avatar.Group
// ---------------------------------------------------------------------------

type GroupFrameProps = GetProps<typeof AvatarGroupFrame>

export interface AvatarGroupProps extends Omit<GroupFrameProps, 'children'> {
  /** Maximum number of avatars to show before collapsing into a +N indicator. */
  max?: number
  /** Uniform size (px) applied to all children + the +N indicator. */
  size?: number
  /**
   * How much each avatar overlaps its neighbour. Positive values overlap
   * (default), negative values would space them out but that's rarely
   * useful — use a plain `XStack gap={...}` for that instead.
   */
  spacing?: number
  children?: ReactNode
}

/**
 * Overlapping avatar stack — like team-member rows and comment threads.
 *
 * ```tsx
 * <Avatar.Group max={3}>
 *   <Avatar src="/joe.jpg"  name="Joe Doe" />
 *   <Avatar src="/jane.jpg" name="Jane Roe" />
 *   <Avatar src="/jim.jpg"  name="Jim Poe" />
 *   <Avatar                 name="Alice Bo" />
 * </Avatar.Group>
 * ```
 */
export const AvatarGroup = forwardRef<HTMLSpanElement, AvatarGroupProps>(function AvatarGroup(
  { max, size = 32, spacing = 8, children, ...rest },
  ref,
) {
  const all = Children.toArray(children).filter(isValidElement) as ReactElement<AvatarProps>[]
  const visible = max ? all.slice(0, max) : all
  const overflow = all.length - visible.length

  return (
    <AvatarGroupFrame ref={ref as never} {...rest}>
      {visible.map((child, index) =>
        cloneElement(child, {
          ring: true,
          size: child.props.size ?? size,
          marginLeft: index === 0 ? 0 : -spacing,
          // Deterministic key: prefer the child's own key, then name, then index.
          key: child.key ?? child.props.name ?? index,
        } as Partial<AvatarProps>),
      )}
      {overflow > 0 ? (
        <AvatarFrame
          width={size}
          height={size}
          ring
          marginLeft={-spacing}
          aria-label={`${overflow} more`}
        >
          <AvatarInitial fontSize={getInitialFontSize(size)}>+{overflow}</AvatarInitial>
        </AvatarFrame>
      ) : null}
    </AvatarGroupFrame>
  )
})

// Compound assembly.
export const Avatar = AvatarBase as AvatarComponent
Avatar.Group = AvatarGroup
