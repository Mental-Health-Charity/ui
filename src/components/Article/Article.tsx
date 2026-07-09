import { forwardRef, type ReactNode } from 'react'
import type { GetProps } from 'tamagui'
import { ArticleFrame, ArticleBannerFrame, ArticleContentFrame } from './Article.styles'

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface ArticleProps extends GetProps<typeof ArticleFrame> {
  children?: ReactNode
}

interface ArticleComponent extends React.ForwardRefExoticComponent<
  ArticleProps & React.RefAttributes<HTMLElement>
> {
  Banner: typeof ArticleBanner
  Content: typeof ArticleContent
}

/**
 * Article — responsive editorial container built as a compound component.
 * Renders semantic `<article>` on web, plain View on native.
 *
 * ```tsx
 * <Article>
 *   <Article.Banner>
 *     <img src="/hero.jpg" alt="..." style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
 *   </Article.Banner>
 *   <Article.Content>
 *     <Typography variant="title3">Heading</Typography>
 *     <Typography variant="regularRegular">Body content…</Typography>
 *   </Article.Content>
 * </Article>
 * ```
 *
 * Layout guarantees:
 *   - Root: `<article>` with 10px padding, full parent width.
 *   - Banner: preserves the 320:157 aspect ratio at any width, 8px radius.
 *   - Content: vertical stack, 12px gap between children.
 */
const ArticleBase = forwardRef<HTMLElement, ArticleProps>(function Article(
  { children, ...rest },
  ref,
) {
  return (
    <ArticleFrame ref={ref as never} {...rest}>
      {children}
    </ArticleFrame>
  )
})

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export interface ArticleBannerProps extends GetProps<typeof ArticleBannerFrame> {
  children?: ReactNode
}

export const ArticleBanner = forwardRef<HTMLElement, ArticleBannerProps>(function ArticleBanner(
  { children, ...rest },
  ref,
) {
  return (
    <ArticleBannerFrame ref={ref as never} {...rest}>
      {children}
    </ArticleBannerFrame>
  )
})

export interface ArticleContentProps extends GetProps<typeof ArticleContentFrame> {
  children?: ReactNode
}

export const ArticleContent = forwardRef<HTMLDivElement, ArticleContentProps>(
  function ArticleContent({ children, ...rest }, ref) {
    return (
      <ArticleContentFrame ref={ref as never} {...rest}>
        {children}
      </ArticleContentFrame>
    )
  },
)

// Compound assembly.
export const Article = ArticleBase as ArticleComponent
Article.Banner = ArticleBanner
Article.Content = ArticleContent
