import React from 'react'
import { headers } from 'next/dist/client/components/headers'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { RequestError } from '@mx-space/api-client'

import { NotSupport } from '~/components/common/NotSupport'
import { CommentAreaRoot } from '~/components/widgets/comment/CommentAreaRoot'
import { REQUEST_GEO } from '~/constants/system'
import { attachUA } from '~/lib/attach-ua'
import { getSummaryFromMd } from '~/lib/markdown'
import { CurrentPageDataProvider } from '~/providers/page/CurrentPageDataProvider'
import { LayoutRightSideProvider } from '~/providers/shared/LayoutRightSideProvider'
import { queries } from '~/queries/definition'
import { getQueryClient } from '~/utils/query-client.server'

export const generateMetadata = async ({
  params,
}: {
  params: PageParams
}): Promise<Metadata> => {
  const { slug } = params
  try {
    attachUA()
    const data = await getQueryClient().fetchQuery(queries.page.bySlug(slug))
    const { title, images, text } = data
    const description = getSummaryFromMd(text ?? '')

    const ogImage = images?.length
      ? {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          url: images[0].src!,
        }
      : undefined
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: ogImage,
        type: 'article',
      },
      twitter: {
        images: ogImage,
        title,
        description,
        card: 'summary_large_image',
      },
    } satisfies Metadata
  } catch {
    return {}
  }
}

interface PageParams {
  slug: string
}

export default async (props: NextPageParams<PageParams>) => {
  attachUA()
  const {
    params: { slug },
  } = props
  const query = queries.page.bySlug(slug)
  // const queryKey = query.queryKey
  const data = await getQueryClient()
    .fetchQuery(query)
    .catch((error) => {
      if (error instanceof RequestError && error.status === 404) {
        return notFound()
      }
      throw error
    })
  const header = headers()
  const geo = header.get(REQUEST_GEO)

  const isCN = geo === 'CN'
  return (
    <>
      <CurrentPageDataProvider data={data} />
      <div className="relative flex min-h-[120px] w-full">
        {props.children}

        <LayoutRightSideProvider className="absolute bottom-0 right-0 top-0 hidden translate-x-full lg:block" />
      </div>
      {isCN ? <NotSupport /> : <CommentAreaRoot refId={data.id} />}
    </>
  )
}
