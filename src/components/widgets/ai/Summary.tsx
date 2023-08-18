'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { NoteModel, PageModel, PostModel } from '@mx-space/api-client'
import type { ArticleDataType } from '~/types/api'
import type { FC, ReactNode } from 'react'

import { AutoResizeHeight } from '~/components/widgets/shared/AutoResizeHeight'
import { API_URL } from '~/constants/env'
import { clsxm } from '~/lib/helper'
import { isNoteModel, isPageModel, isPostModel } from '~/lib/url-builder'

export const AISummary: FC<{
  data: PostModel | NoteModel | PageModel
  className?: string
}> = (props) => {
  const { data } = props

  const payload = useMemo(() => {
    let payload: ArticleDataType

    if (isPostModel(data)) {
      payload = {
        category: data.category.slug,
        slug: data.slug,
        type: 'post',
      }
    } else if (isNoteModel(data)) {
      payload = {
        nid: data.nid,
        type: 'note',
      }
    } else if (isPageModel(data)) {
      payload = {
        slug: data.slug,
        type: 'page',
      }
    } else {
      throw new Error('未知类型')
    }

    return payload
  }, [data])
  const { data: response, isLoading } = useQuery<{
    summary: string
    source: string
  }>(
    [`ai-summary`, data.id, API_URL, data.modified],
    async () => {
      const data = await fetch(
        `/api/ai/summary?data=${encodeURIComponent(JSON.stringify(payload))}`,
        {
          next: {
            revalidate: 60 * 10,
          },
        },
      ).then((res) => res.json())
      if (!data) throw new Error('请求错误')
      return data
    },
    {
      staleTime: 1000 * 60 * 60 * 24 * 7,
      retryDelay: 5000,
    },
  )

  const Inner: ReactNode = (
    <div
      data-hide-print
      className={clsxm(
        `space-y-2 rounded-xl border border-slate-200 p-4 dark:border-neutral-800`,
        props.className,
      )}
    >
      <div className="flex items-center">
        <i className="icon-[mingcute--sparkles-line] mr-2 text-lg" />
        AI 生成的摘要
      </div>

      <AutoResizeHeight duration={0.3}>
        <p className="text-base-content/85 !m-0 text-sm leading-loose">
          {isLoading ? (
            <div className="space-y-2">
              <span className="block h-5 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-neutral-800" />
              <span className="block h-5 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-neutral-800" />
              <span className="block h-5 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-neutral-800" />
            </div>
          ) : (
            response?.summary
          )}
        </p>
      </AutoResizeHeight>
    </div>
  )

  return (
    <AutoResizeHeight duration={0.2} className="mt-4">
      {Inner}
    </AutoResizeHeight>
  )
}
