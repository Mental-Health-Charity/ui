import { styled, Stack, Text } from 'tamagui'

/**
 * Switch styles — pill track + circular thumb sliding between two positions.
 *
 *   SwitchRoot   ← outer <label> row (thumb + optional label)
 *   SwitchTrack  ← the pill background; colour driven by `state`
 *   SwitchThumb  ← the circle; horizontal position driven by `checked`
 *
 * All dimensions live in `size` variants so track/thumb/travel stay in
 * lockstep — never edit one without the others.
 */

// ---------------------------------------------------------------------------
// Size table — single source of truth for track/thumb geometry per size
// ---------------------------------------------------------------------------

/**
 * Exposed as a plain map so the component can read exact pixels for the
 * thumb-translate math (Tamagui doesn't know the size at runtime).
 */
export const SWITCH_METRICS = {
  sm: { trackWidth: 32, trackHeight: 18, thumbSize: 14, padding: 2 },
  md: { trackWidth: 40, trackHeight: 22, thumbSize: 18, padding: 2 },
  lg: { trackWidth: 48, trackHeight: 26, thumbSize: 22, padding: 2 },
} as const

export type SwitchSize = keyof typeof SWITCH_METRICS

export function getThumbTranslate(size: SwitchSize): number {
  const m = SWITCH_METRICS[size]
  // Travel distance = track width − thumb size − 2 × padding (thumb sits
  // `padding` in from each end).
  return m.trackWidth - m.thumbSize - m.padding * 2
}

// ---------------------------------------------------------------------------
// Root — full-row label wrapper
// ---------------------------------------------------------------------------

export const SwitchRoot = styled(Stack, {
  name: 'SwitchRoot',
  tag: 'label',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  cursor: 'pointer',
  userSelect: 'none',

  variants: {
    disabled: {
      true: {
        cursor: 'not-allowed',
        opacity: 0.6,
      },
    },
    /** Renders label on the left of the switch when true. */
    labelStart: {
      true: {
        flexDirection: 'row-reverse',
      },
    },
  } as const,
})

// ---------------------------------------------------------------------------
// Track — the pill background. Position: relative so the thumb (absolute)
// can slide inside it.
// ---------------------------------------------------------------------------

export const SwitchTrack = styled(Stack, {
  name: 'SwitchTrack',
  tag: 'span',
  position: 'relative',
  borderRadius: '$full',
  flexShrink: 0,

  focusVisibleStyle: {
    outlineColor: '$borderColorFocus',
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineOffset: 2,
  },

  variants: {
    size: {
      sm: { width: SWITCH_METRICS.sm.trackWidth, height: SWITCH_METRICS.sm.trackHeight },
      md: { width: SWITCH_METRICS.md.trackWidth, height: SWITCH_METRICS.md.trackHeight },
      lg: { width: SWITCH_METRICS.lg.trackWidth, height: SWITCH_METRICS.lg.trackHeight },
    },

    state: {
      off: { backgroundColor: '$skyBase' },
      on: { backgroundColor: '$primary' },
      offError: { backgroundColor: '$skyBase' },
      onError: { backgroundColor: '$danger' },
      offDisabled: { backgroundColor: '$skyLight' },
      onDisabled: { backgroundColor: '$skyBase' },
    },
  } as const,

  defaultVariants: {
    size: 'md',
    state: 'off',
  },
})

// ---------------------------------------------------------------------------
// Thumb — absolute-positioned circle. Position controlled via `transform`
// from the component (Tamagui animations don't apply to variants directly
// without an `animation` config, so we drive it with an inline prop).
// ---------------------------------------------------------------------------

export const SwitchThumb = styled(Stack, {
  name: 'SwitchThumb',
  tag: 'span',
  position: 'absolute',
  borderRadius: '$full',
  backgroundColor: '$background', // white in light theme, ink in dark
  shadowColor: '$shadowColor',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 1,
  shadowRadius: 2,
  animation: 'quick',

  variants: {
    size: {
      sm: {
        width: SWITCH_METRICS.sm.thumbSize,
        height: SWITCH_METRICS.sm.thumbSize,
        top: SWITCH_METRICS.sm.padding,
        left: SWITCH_METRICS.sm.padding,
      },
      md: {
        width: SWITCH_METRICS.md.thumbSize,
        height: SWITCH_METRICS.md.thumbSize,
        top: SWITCH_METRICS.md.padding,
        left: SWITCH_METRICS.md.padding,
      },
      lg: {
        width: SWITCH_METRICS.lg.thumbSize,
        height: SWITCH_METRICS.lg.thumbSize,
        top: SWITCH_METRICS.lg.padding,
        left: SWITCH_METRICS.lg.padding,
      },
    },
  } as const,

  defaultVariants: { size: 'md' },
})

// ---------------------------------------------------------------------------
// Label + helper — mirror Checkbox/Radio typography
// ---------------------------------------------------------------------------

export const SwitchLabelText = styled(Text, {
  name: 'SwitchLabelText',
  fontFamily: '$body',
  fontWeight: '400',
  color: '$color',

  variants: {
    size: {
      sm: { fontSize: 14, lineHeight: 20 },
      md: { fontSize: 16, lineHeight: 22 },
      lg: { fontSize: 16, lineHeight: 22 },
    },
    tone: {
      default: { color: '$color' },
      disabled: { color: '$colorMuted' },
      error: { color: '$danger' },
    },
  } as const,

  defaultVariants: {
    size: 'md',
    tone: 'default',
  },
})

export const SwitchHelperText = styled(Text, {
  name: 'SwitchHelperText',
  fontFamily: '$body',
  fontSize: 14,
  lineHeight: 20,
  fontWeight: '400',

  variants: {
    tone: {
      caption: { color: '$inkLighter' },
      error: { color: '$danger' },
    },
  } as const,

  defaultVariants: { tone: 'caption' },
})

// ---------------------------------------------------------------------------
// Resolver
// ---------------------------------------------------------------------------

export type SwitchTrackState = 'off' | 'on' | 'offError' | 'onError' | 'offDisabled' | 'onDisabled'

export function resolveSwitchState(input: {
  disabled: boolean
  checked: boolean
  hasError: boolean
}): SwitchTrackState {
  const { disabled, checked, hasError } = input
  if (disabled) return checked ? 'onDisabled' : 'offDisabled'
  if (hasError) return checked ? 'onError' : 'offError'
  return checked ? 'on' : 'off'
}
