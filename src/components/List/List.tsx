import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  type ReactElement,
  type ReactNode,
} from 'react'
import type { GestureResponderEvent } from 'react-native'
import {
  ListItemBullet,
  ListItemContent,
  ListItemDescription,
  ListItemLeading,
  ListItemMarker,
  ListItemMeta,
  ListItemNumber,
  ListItemRow,
  ListItemTitle,
  ListRoot,
  resolveListItemState,
} from './List.styles'

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type ListVariant = 'bullet' | 'number' | 'plain' | 'divided'
export type ListSize = 'sm' | 'md' | 'lg'
export type ListSpacing = 'compact' | 'cozy' | 'relaxed'
export type ListBulletTone = 'default' | 'muted' | 'primary'

export interface ListProps {
  /**
   * Visual style.
   *   - `bullet`   → renders `<ul>` with our custom dot markers
   *   - `number`   → renders `<ol>` with our custom numeric markers
   *   - `plain`    → renders `<ul>` with no marker column (`list-style: none`)
   *   - `divided`  → plain layout + hairline dividers between rows
   */
  variant?: ListVariant
  size?: ListSize
  /** Gap between items. Ignored for `divided` — rows share a border. */
  spacing?: ListSpacing
  /** Optional custom starting number for the `number` variant. Defaults to 1. */
  start?: number
  children: ReactNode
}

// ---------------------------------------------------------------------------
// Internal item props injected by List during cloneElement.
// Consumers never set these — they exist so the item can render its own
// marker (based on position) without the caller repeating index math.
// ---------------------------------------------------------------------------

interface InternalItemProps {
  _index?: number
  _total?: number
}

export interface ListItemProps extends InternalItemProps {
  /** Main text of the row. Renders as the title. */
  children?: ReactNode
  /**
   * Optional secondary line below the title. Rendered in muted colour.
   * Accepts a string or ReactNode for richer content.
   */
  description?: ReactNode
  /**
   * Optional icon rendered before the text (independent of the bullet /
   * number marker). Common for feature lists — a check next to each perk.
   */
  startIcon?: ReactNode
  /**
   * Optional trailing content pinned to the right edge (badge, timestamp,
   * chevron). Aligns with the title's baseline even when a long description
   * wraps beneath.
   */
  meta?: ReactNode
  /**
   * Makes the row interactive. Adds hover / press / focus affordance and
   * fires on click/tap. When set, the row becomes a `role="button"`.
   */
  onPress?: (event: GestureResponderEvent) => void
  /** Highlighted state — for lists that act as menus / navigation. */
  selected?: boolean
  /** Non-interactive state. Only meaningful when `onPress` is also set. */
  disabled?: boolean
  /**
   * Override the numeric marker for the `number` variant. Rare — used when
   * consumers want a non-sequential label (e.g. "1a", "2b"). Ignored on
   * non-numbered lists.
   */
  markerLabel?: ReactNode
  /**
   * Override the bullet tone for the `bullet` variant. Ignored otherwise.
   */
  bulletTone?: ListBulletTone
}

// ---------------------------------------------------------------------------
// Context — one source of truth for variant / size / numbering
// ---------------------------------------------------------------------------

interface ListContextValue {
  variant: ListVariant
  size: ListSize
  /** 1-based start number for the `number` variant. */
  start: number
}

const ListContext = createContext<ListContextValue | null>(null)

function useListContext(): ListContextValue {
  // A ListItem used outside a List is a legitimate case (one-off demos,
  // isolated stories); fall back to sensible defaults rather than throwing.
  return useContext(ListContext) ?? { variant: 'plain', size: 'md', start: 1 }
}

// ---------------------------------------------------------------------------
// ListItem — a single row
// ---------------------------------------------------------------------------

const ListItemBase = forwardRef<never, ListItemProps>(function ListItem(
  {
    children,
    description,
    startIcon,
    meta,
    onPress,
    selected = false,
    disabled = false,
    markerLabel,
    bulletTone = 'default',
    _index,
    _total,
  },
  ref,
) {
  const { variant, size, start } = useListContext()

  const isInteractive = Boolean(onPress) && !disabled
  const state = resolveListItemState({ selected, disabled })

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      if (disabled) return
      onPress?.(event)
    },
    [disabled, onPress],
  )

  const index = _index ?? 0
  const total = _total ?? 1
  const isLast = index === total - 1

  return (
    <ListItemRow
      ref={ref as never}
      size={size}
      divided={variant === 'divided'}
      isLast={isLast}
      interactive={isInteractive}
      state={state}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-disabled={disabled || undefined}
      aria-current={selected || undefined}
      onPress={isInteractive ? handlePress : undefined}
    >
      {renderMarker({ variant, size, index, start, markerLabel, bulletTone })}

      {startIcon ? <ListItemLeading size={size}>{startIcon}</ListItemLeading> : null}

      <ListItemContent>
        <ListItemTitle size={size} weight={description ? 'medium' : 'regular'}>
          {children}
        </ListItemTitle>
        {description ? <ListItemDescription size={size}>{description}</ListItemDescription> : null}
      </ListItemContent>

      {meta ? <ListItemMeta>{meta}</ListItemMeta> : null}
    </ListItemRow>
  )
})

// ---------------------------------------------------------------------------
// List container
// ---------------------------------------------------------------------------

/**
 * List — a vertical stack of `ListItem` rows with a variant-driven marker
 * (bullet, number, none, or dividers). Renders semantic `<ul>` / `<ol>` on
 * web and a `<View>` on native — always with our own visual markers so the
 * appearance matches across platforms.
 *
 * Numbering + `divided` last-row suppression are handled here by cloning
 * children with an internal `_index` / `_total` pair; consumers never need
 * to pass these props themselves.
 *
 * Two usage forms:
 *
 * ```tsx
 * // Ergonomic — <List.Item /> attached as a static property.
 * <List variant="bullet">
 *   <List.Item>First</List.Item>
 *   <List.Item>Second</List.Item>
 * </List>
 *
 * // Explicit imports — same components, no compound access.
 * import { List, ListItem } from '@peryskop/ui'
 * <List>
 *   <ListItem>First</ListItem>
 * </List>
 * ```
 */
const ListBase = forwardRef<never, ListProps>(function List(
  { variant = 'plain', size = 'md', spacing = 'cozy', start = 1, children },
  ref,
) {
  const context = useMemo<ListContextValue>(
    () => ({ variant, size, start }),
    [variant, size, start],
  )

  // Filter to valid elements once so index math + `total` count match.
  // React children can include strings, numbers, and falsy values; those
  // should be skipped rather than take a slot in the sequence.
  const items = useMemo(() => {
    const valid: ReactElement[] = []
    Children.forEach(children, (child) => {
      if (isValidElement(child)) valid.push(child)
    })
    return valid
  }, [children])

  const total = items.length
  const rootTag = variant === 'number' ? 'ol' : 'ul'

  return (
    <ListContext.Provider value={context}>
      <ListRoot
        ref={ref as never}
        tag={rootTag}
        variant={variant}
        spacing={spacing}
        // Web-only CSS reset — suppresses the browser's default disc / decimal
        // marker so ours is the only marker shown. React Native silently
        // ignores unknown style keys, so this is safe cross-platform.
        style={{ listStyleType: 'none' } as never}
        // `start` on `<ol>` is an HTML attribute — only emit it when
        // non-default so screen readers announce the intended sequence.
        {...(variant === 'number' && start !== 1 ? { start } : {})}
      >
        {items.map((child, index) =>
          cloneElement(child as ReactElement<InternalItemProps>, {
            _index: index,
            _total: total,
            key: child.key ?? index,
          }),
        )}
      </ListRoot>
    </ListContext.Provider>
  )
})

// ---------------------------------------------------------------------------
// Marker rendering — no state, factored out to keep the row body skimmable
// ---------------------------------------------------------------------------

function renderMarker({
  variant,
  size,
  index,
  start,
  markerLabel,
  bulletTone,
}: {
  variant: ListVariant
  size: ListSize
  index: number
  start: number
  markerLabel: ReactNode
  bulletTone: ListBulletTone
}) {
  if (variant === 'bullet') {
    return (
      <ListItemMarker size={size}>
        <ListItemBullet size={size} tone={bulletTone} />
      </ListItemMarker>
    )
  }

  if (variant === 'number') {
    return (
      <ListItemMarker size={size}>
        <ListItemNumber size={size}>{markerLabel ?? `${start + index}.`}</ListItemNumber>
      </ListItemMarker>
    )
  }

  // `plain` and `divided` render no marker column.
  return null
}

// ---------------------------------------------------------------------------
// Exports — List with .Item attached, plus ListItem as a standalone export
// ---------------------------------------------------------------------------

/**
 * `List` with `List.Item` attached for the compound-component ergonomic.
 * `ListItem` remains a standalone named export for consumers who prefer
 * explicit imports.
 */
export const List = Object.assign(ListBase, { Item: ListItemBase })
export const ListItem = ListItemBase
