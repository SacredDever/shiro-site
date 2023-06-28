'use client'

import { createContext, useCallback, useContext, useRef } from 'react'
import { atom, useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import type { ExtractAtomValue } from 'jotai'
import type { PropsWithChildren } from 'react'

import { jotaiStore } from '~/lib/store'

import { MAX_COMMENT_TEXT_LENGTH } from '../constants'

const createInitialValue = () => ({
  refId: atom(''),

  text: atom(''),
  author: atom(''),
  mail: atom(''),
  url: atom(''),

  avatar: atom(''),
  source: atom(''),
})
const CommentBoxContext = createContext(createInitialValue())
export const CommentBoxProvider = (
  props: PropsWithChildren & { refId: string },
) => {
  return (
    <CommentBoxContext.Provider
      key={props.refId}
      value={
        useRef({
          ...createInitialValue(),
          refId: atom(props.refId),
        }).current
      }
    >
      {props.children}
    </CommentBoxContext.Provider>
  )
}

export const useCommentBoxTextValue = () =>
  useAtomValue(useContext(CommentBoxContext).text)

export const useCommentBoxRefIdValue = () =>
  useAtomValue(useContext(CommentBoxContext).refId)

export const useGetCommentBoxAtomValues = () => {
  return useContext(CommentBoxContext)
}

export const useCommentBoxHasText = () =>
  useAtomValue(
    selectAtom(
      useContext(CommentBoxContext).text,
      useCallback((v) => v.length > 0, []),
    ),
  )

export const useCommentBoxTextIsOversize = () =>
  useAtomValue(
    selectAtom(
      useContext(CommentBoxContext).text,
      useCallback((v) => v.length > MAX_COMMENT_TEXT_LENGTH, []),
    ),
  )
type CommentContextValue = ReturnType<typeof createInitialValue>

export const useSetCommentBoxValues = <
  T extends keyof CommentContextValue,
>() => {
  const ctx = useContext(CommentBoxContext)
  return (key: T, value: ExtractAtomValue<CommentContextValue[T]>) => {
    const atom = ctx[key]
    if (!atom) throw new Error(`atom ${key} not found`)
    jotaiStore.set(atom, value)
  }
}
