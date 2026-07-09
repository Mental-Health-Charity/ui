import { styled, Stack } from 'tamagui'

/**
 * Article styles — a responsive editorial-style container.
 *
 * `Article` renders a semantic <article> on web. Banner + Content sub-frames
 * are structural — layout only, no colours, so they inherit surrounding tone.
 */

export const ArticleFrame = styled(Stack, {
  name: 'ArticleFrame',
  tag: 'article',
  flexDirection: 'column',
  padding: 10,
  gap: 10,
  width: '100%',
})

// Banner — responsive image container. Original design: 320×157 (ratio
// 320:157 ≈ 2.038 : 1). We use `aspectRatio` so the banner scales to the
// parent's width while preserving the same shape.
//
// `<figure>` carries the semantic weight (a self-contained media unit).
// UA styles apply `margin: 0 40px` to `<figure>` by default — we reset all
// four sides so the banner fills its parent width instead of overflowing.
export const ArticleBannerFrame = styled(Stack, {
  name: 'ArticleBanner',
  tag: 'figure',
  margin: 0,
  width: '100%',
  aspectRatio: 320 / 157,
  borderRadius: 8,
  overflow: 'hidden',
  backgroundColor: '$backgroundStrong', // subtle placeholder for empty banners
})

export const ArticleContentFrame = styled(Stack, {
  name: 'ArticleContent',
  tag: 'div',
  flexDirection: 'column',
  gap: 12,
  width: '100%',
})
