import { forwardRef, type ReactElement, type ReactNode } from 'react'
import type { GetProps } from 'tamagui'
import {
  CardFrame,
  CardHeaderFrame,
  CardBodyFrame,
  CardFooterFrame,
  type CardVariant,
} from './Card.styles'

type FrameProps = GetProps<typeof CardFrame>

export interface CardProps extends Omit<
  FrameProps,
  'children' | 'disabled' | 'hoverable' | 'clickable'
> {
  /** Surface treatment. Defaults to `'elevated'`. */
  variant?: CardVariant
  /**
   * Adds a subtle hover background — useful for lists where cards are
   * visually distinguishable on pointer-over but aren't themselves
   * clickable (the row containing them handles the click).
   */
  hoverable?: boolean
  /**
   * Turns the card into a full button surface: pointer cursor, hover +
   * press effects, keyboard-focus ring, `role="button"`. Automatically
   * enabled when `onPress` is provided.
   */
  clickable?: boolean
  /** Non-interactive state — mutes colours, blocks click. */
  disabled?: boolean
  /**
   * Polymorphism — Tamagui's `render` prop. String for an HTML tag on web
   * (`render="article"`), JSX element to clone with card's computed props
   * (`render={<a href="..." />}`). String form is optimized by the compiler.
   */
  render?: string | ReactElement
  children?: ReactNode
}

interface CardComponent extends React.ForwardRefExoticComponent<
  CardProps & React.RefAttributes<HTMLDivElement>
> {
  Header: typeof CardHeader
  Body: typeof CardBody
  Footer: typeof CardFooter
}

/**
 * Content surface — the go-to container for a discrete chunk of UI
 * (a summary block, a list row, a media object). Defaults match Figma:
 * `skyLighter` background, 16px radius, 10px padding, small shadow.
 *
 * Composition (all sections optional):
 *
 * ```tsx
 * <Card variant="elevated" onPress={openDetails}>
 *   <Card.Header>
 *     <Typography variant="regularSemibold">Team standup</Typography>
 *     <Typography variant="smallRegular" muted>10:00 · Room A</Typography>
 *   </Card.Header>
 *   <Card.Body>
 *     <Typography>Discuss weekly priorities.</Typography>
 *   </Card.Body>
 *   <Card.Footer>
 *     <Button variant="mutedPrimary">Cancel</Button>
 *     <Button>Join</Button>
 *   </Card.Footer>
 * </Card>
 * ```
 *
 * Use `render` (Tamagui's polymorphism prop) to swap the underlying element:
 *
 * ```tsx
 * <Card render="article">…</Card>
 * <Card render={<a href="/team-standup" />}>…</Card>
 * ```
 */
const CardBase = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    variant = 'elevated',
    hoverable = false,
    clickable,
    disabled = false,
    onPress,
    render,
    children,
    ...rest
  },
  ref,
) {
  // `onPress` implies clickable — spares consumers from having to remember
  // to pass both. Explicit `clickable={false}` still wins if they want
  // a card that fires onPress without visually acting like a button.
  const isClickable = clickable ?? Boolean(onPress)

  // `render` is a Tamagui runtime-supported prop but its type isn't exposed
  // on the child styled component's Props. Forward via a cast + extra props
  // object so the pass-through is explicit at the call site.
  const passthrough = render !== undefined ? ({ render } as never) : undefined

  return (
    <CardFrame
      ref={ref as never}
      variant={variant}
      hoverable={hoverable && !isClickable}
      clickable={isClickable}
      disabled={disabled}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable && !disabled ? 0 : undefined}
      aria-disabled={disabled || undefined}
      onPress={isClickable && !disabled ? onPress : undefined}
      {...(passthrough as object | undefined)}
      {...rest}
    >
      {children}
    </CardFrame>
  )
})

// ---------------------------------------------------------------------------
// Sections — semantic sub-components
// ---------------------------------------------------------------------------

export interface CardSectionProps extends GetProps<typeof CardHeaderFrame> {}

export const CardHeader = forwardRef<HTMLDivElement, CardSectionProps>(function CardHeader(
  { children, ...rest },
  ref,
) {
  return (
    <CardHeaderFrame ref={ref as never} {...rest}>
      {children}
    </CardHeaderFrame>
  )
})

export const CardBody = forwardRef<HTMLDivElement, CardSectionProps>(function CardBody(
  { children, ...rest },
  ref,
) {
  return (
    <CardBodyFrame ref={ref as never} {...rest}>
      {children}
    </CardBodyFrame>
  )
})

export const CardFooter = forwardRef<HTMLDivElement, CardSectionProps>(function CardFooter(
  { children, ...rest },
  ref,
) {
  return (
    <CardFooterFrame ref={ref as never} {...rest}>
      {children}
    </CardFooterFrame>
  )
})

// Attach sub-components as static properties for the compound API.
export const Card = CardBase as CardComponent
Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter
