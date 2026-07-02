import { forwardRef, type ReactNode } from 'react'
import { YStack, type GetProps } from 'tamagui'

type YStackProps = GetProps<typeof YStack>

export interface FormGroupProps extends Omit<YStackProps, 'children'> {
  /**
   * Vertical space between fields. Defaults to `$lg` (16px) which reads
   * comfortably between form rows without feeling loose.
   */
  gap?: YStackProps['gap']
  children: ReactNode
}

/**
 * FormGroup — vertical layout wrapper for form fields (Input, Select, etc.).
 * Applies consistent spacing and `role="group"` for a11y (screen readers
 * announce the grouping when navigating).
 *
 * For a labelled section, wrap FormGroup with a heading or pass
 * `aria-labelledby="{headingId}"`.
 */
export const FormGroup = forwardRef<never, FormGroupProps>(function FormGroup(
  { gap = '$lg', children, ...rest },
  ref
) {
  return (
    <YStack ref={ref as never} gap={gap} role="group" {...rest}>
      {children}
    </YStack>
  )
})
