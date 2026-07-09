import { forwardRef, type ReactNode } from 'react'
import { XStack, YStack, Text, type GetProps } from 'tamagui'

type XStackProps = GetProps<typeof XStack>

export interface PersonProps extends Omit<XStackProps, 'children'> {
  /**
   * Primary label (usually the person's full name). Rendered with the
   * `regular/semibold` variant in `$inkBase`.
   */
  name: ReactNode
  /**
   * Secondary label below the name (role, title, email, description).
   * Rendered with `tiny/semibold` in `$colorMuted`. Omit for a
   * name-only presentation.
   */
  description?: ReactNode
  /**
   * Avatar slot — accepts an `<Avatar>` (or any element that fits a small
   * leading area). Left-aligned, spaced from the labels by `$sm`.
   */
  avatar?: ReactNode
  /**
   * How to align the labels vertically against the avatar. Defaults to
   * `'center'` — works for the common 1-line name + 1-line role case.
   */
  align?: 'center' | 'start'
}

/**
 * Compact user / author presenter — an avatar next to a name+description block.
 *
 * The most common form is `Avatar + name + description` (member row, comment
 * header, list item leading area). Both `avatar` and `description` are
 * optional, so `<Person name="Joe Doe" />` renders just the name — handy in
 * dense contexts.
 *
 * ```tsx
 * <Person
 *   avatar={<Avatar src="/joe.jpg" name="Joe Doe" />}
 *   name="Joe Doe"
 *   description="Administrator"
 * />
 * ```
 *
 * When you need more custom composition (multiple roles, actions on the right,
 * a status badge, etc.), drop down to a plain `XStack` — `Person` is intentionally
 * limited to the presenter pattern.
 */
export const Person = forwardRef<HTMLDivElement, PersonProps>(function Person(
  { avatar, name, description, align = 'center', ...rest },
  ref,
) {
  return (
    <XStack
      ref={ref as never}
      alignItems={align === 'center' ? 'center' : 'flex-start'}
      gap="$sm"
      {...rest}
    >
      {avatar}
      <YStack gap={2}>
        {typeof name === 'string' ? (
          <Text fontFamily="$body" fontSize={16} lineHeight={21} fontWeight="500" color="$inkBase">
            {name}
          </Text>
        ) : (
          name
        )}
        {description !== undefined && description !== null ? (
          typeof description === 'string' ? (
            <Text
              fontFamily="$body"
              fontSize={12}
              lineHeight={16}
              fontWeight="500"
              color="$inkLight"
            >
              {description}
            </Text>
          ) : (
            description
          )
        ) : null}
      </YStack>
    </XStack>
  )
})
