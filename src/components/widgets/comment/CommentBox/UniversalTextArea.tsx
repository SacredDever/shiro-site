'use client'

import { useCallback, useRef } from 'react'
import clsx from 'clsx'
import { m, useMotionTemplate, useMotionValue } from 'framer-motion'

import { useIsMobile } from '~/atoms'

import { getRandomPlaceholder } from './constants'
import { useCommentBoxTextValue, useSetCommentBoxValues } from './hooks'

export const UniversalTextArea = () => {
  const placeholder = useRef(getRandomPlaceholder()).current
  const setter = useSetCommentBoxValues()
  const value = useCommentBoxTextValue()

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const handleMouseMove = useCallback(
    ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
      const bounds = currentTarget.getBoundingClientRect()
      mouseX.set(clientX - bounds.left)
      mouseY.set(clientY - bounds.top)
    },
    [mouseX, mouseY],
  )
  const background = useMotionTemplate`radial-gradient(320px circle at ${mouseX}px ${mouseY}px, var(--spotlight-color) 0%, transparent 85%)`
  const isMobile = useIsMobile()
  return (
    <div
      className="group relative h-full [--spotlight-color:hsl(var(--a)_/_0.05)]"
      onMouseMove={handleMouseMove}
    >
      {!isMobile && (
        <m.div
          className="pointer-events-none absolute left-0 right-0 top-0 z-0 h-[150px] rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background }}
          aria-hidden="true"
        />
      )}
      <textarea
        value={value}
        onChange={(e) => {
          setter('text', e.target.value)
        }}
        placeholder={placeholder}
        className={clsx(
          'h-full w-full resize-none bg-transparent',
          'overflow-auto px-3 py-4',
          'text-neutral-900/80 dark:text-slate-100/80',
        )}
      />
    </div>
  )
}
