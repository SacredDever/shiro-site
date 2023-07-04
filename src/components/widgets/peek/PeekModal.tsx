import { m } from 'framer-motion'
import Link from 'next/link'
import type { PropsWithChildren } from 'react'

import { microReboundPreset } from '~/constants/spring'
import { useModalStack } from '~/providers/root/modal-stack-provider'

export const PeekModal = (
  props: PropsWithChildren<{
    to: string
  }>,
) => {
  const { dismissAll } = useModalStack()
  return (
    <m.div
      initial={{ y: 100, opacity: 0.5 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={microReboundPreset}
      className="relative mt-[10vh] max-w-full overflow-auto px-2 lg:max-w-[65rem] lg:p-0"
    >
      {props.children}

      <Link
        className="absolute right-2 top-2 flex h-8 w-8 rounded-full p-1 shadow-sm ring-1 ring-zinc-200 center dark:ring-neutral-800"
        href={props.to}
        onClick={dismissAll}
      >
        <i className="icon-[mingcute--fullscreen-2-line] text-lg" />
        <span className="sr-only">Go to this link</span>
      </Link>
    </m.div>
  )
}
