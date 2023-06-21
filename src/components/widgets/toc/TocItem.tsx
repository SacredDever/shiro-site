import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { tv } from 'tailwind-variants'
import type { FC, MouseEvent } from 'react'

import { useWrappedElement } from '~/providers/shared/WrappedElementProvider'
import { clsxm } from '~/utils/helper'

import { escapeSelector } from './escapeSelector'

const styles = tv({
  base: clsxm(
    'leading-normal mb-[1.5px] text-neutral-content inline-block relative max-w-full min-w-0',
    'truncate text-left opacity-50 transition-all tabular-nums hover:opacity-80 duration-500',
  ),
  variants: {
    status: {
      active: 'ml-2 opacity-100',
    },
  },
})
export interface ITocItem {
  depth: number
  title: string
  anchorId: string
  index: number
}

export const TocItem: FC<{
  title: string
  anchorId: string
  depth: number
  active: boolean
  rootDepth: number
  onClick?: (i: number, $el: HTMLElement | null, anchorId: string) => void
  index: number
  // containerRef?: RefObject<HTMLDivElement>
}> = memo((props) => {
  const { index, active, depth, title, rootDepth, onClick, anchorId } = props

  const $ref = useRef<HTMLAnchorElement>(null)
  useEffect(() => {
    if (active) {
      const state = history.state
      history.replaceState(state, '', `#${anchorId}`)
    }
  }, [active, anchorId])

  const renderDepth = useMemo(() => {
    const result = depth - rootDepth

    return result
  }, [depth, rootDepth])
  const $article = useWrappedElement()
  return (
    <a
      ref={$ref}
      data-index={index}
      href={`#${anchorId}`}
      className={clsxm(
        styles({
          status: active ? 'active' : undefined,
        }),
      )}
      style={useMemo(
        () => ({
          paddingLeft:
            depth >= rootDepth ? `${renderDepth * 0.6}rem` : undefined,
        }),
        [depth, renderDepth, rootDepth],
      )}
      data-depth={depth}
      onClick={useCallback(
        (e: MouseEvent) => {
          e.preventDefault()
          const $el = $article?.querySelector(
            `#${escapeSelector(anchorId)}`,
          ) as any as HTMLElement

          onClick?.(index, $el, anchorId)
        },
        [onClick, index, $article, anchorId],
      )}
      title={title}
    >
      <span className="cursor-pointer">{title}</span>
    </a>
  )
})
