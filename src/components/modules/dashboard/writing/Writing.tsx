import React, { useEffect, useRef } from 'react'
import { produce } from 'immer'
import { atom, useAtomValue, useSetAtom, useStore } from 'jotai'
import type { FC } from 'react'
import type { MilkdownRef } from '../../../ui/editor'

import { editorViewCtx, schemaCtx } from '@milkdown/core'
import { redoCommand, undoCommand } from '@milkdown/plugin-history'
import {
  toggleEmphasisCommand,
  toggleStrongCommand,
  wrapInBulletListCommand,
  wrapInHeadingCommand,
  wrapInOrderedListCommand,
} from '@milkdown/preset-commonmark'
import { callCommand } from '@milkdown/utils'

import { useEventCallback } from '~/hooks/common/use-event-callback'
import { clsxm } from '~/lib/helper'
import { jotaiStore } from '~/lib/store'

import { MilkdownEditor } from '../../../ui/editor'
import { useBaseWritingContext } from './BaseWritingProvider'
import { TitleInput } from './TitleInput'

export const Writing: FC<{
  middleSlot?: React.ReactNode | React.FunctionComponent<any>

  titleLabel?: string
}> = ({ middleSlot, titleLabel }) => {
  const middleSlotElement =
    typeof middleSlot === 'function'
      ? React.createElement(middleSlot)
      : middleSlot
  return (
    <>
      <TitleInput label={titleLabel} />

      {middleSlotElement && (
        <div className="my-3 flex items-center pl-2 text-sm text-gray-500">
          {middleSlotElement}
        </div>
      )}

      <Editor />
    </>
  )
}

const MenuBar = () => {
  const editorRef = useEditorRef()

  const menuList = [
    {
      icon: 'icon-[material-symbols--undo]',
      action: () => editorRef?.getAction(callCommand(undoCommand.key)),
    },
    {
      icon: 'icon-[material-symbols--redo]',
      action: () => editorRef?.getAction(callCommand(redoCommand.key)),
    },
    {
      icon: 'icon-[mingcute--bold-fill]',
      action: () => editorRef?.getAction(callCommand(toggleStrongCommand.key)),
    },
    {
      icon: 'icon-[mingcute--italic-fill]',
      action: () =>
        editorRef?.getAction(callCommand(toggleEmphasisCommand.key)),
    },
    {
      icon: 'icon-[mingcute--list-check-fill]',
      action: () =>
        editorRef?.getAction(callCommand(wrapInBulletListCommand.key)),
    },
    {
      icon: 'icon-[material-symbols--format-list-numbered-rounded]',
      action: () =>
        editorRef?.getAction(callCommand(wrapInOrderedListCommand.key)),
    },
    {
      icon: 'icon-[material-symbols--format-h1]',
      action: () =>
        editorRef?.getAction(callCommand(wrapInHeadingCommand.key, 1)),
    },
    {
      icon: 'icon-[material-symbols--format-h2]',
      action: () =>
        editorRef?.getAction(callCommand(wrapInHeadingCommand.key, 2)),
    },
    {
      icon: 'icon-[material-symbols--format-h3]',
      action: () =>
        editorRef?.getAction(callCommand(wrapInHeadingCommand.key, 3)),
    },
    {
      icon: 'icon-[material-symbols--format-h4]',
      action: () =>
        editorRef?.getAction(callCommand(wrapInHeadingCommand.key, 4)),
    },
    {
      icon: 'icon-[mingcute--drawing-board-line]',
      action: () => {
        const ctx = editorRef?.editor.ctx
        if (!ctx) return
        const view = ctx.get(editorViewCtx)
        if (!view) return
        const state = view.state

        const currentCursorPosition = state.selection.from
        const nextNode = ctx.get(schemaCtx).node('code_block', {
          language: 'excalidraw',
        })

        view.dispatch(state.tr.insert(currentCursorPosition, nextNode))
      },
    },
  ]

  return (
    <div className="my-2 flex w-full flex-wrap space-x-2">
      {menuList.map((menu, key) => (
        <button
          key={key}
          className="flex items-center justify-center rounded p-2 text-xl text-gray-500 hover:bg-gray-300 hover:text-black dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
          onClick={() => {
            menu.action()

            editorRef?.getAction((ctx) => {
              ctx.get(editorViewCtx).focus()
            })
          }}
        >
          <i className={menu.icon} />
        </button>
      ))}
    </div>
  )
}

const Editor = () => {
  const ctxAtom = useBaseWritingContext()
  const setAtom = useSetAtom(ctxAtom)
  const setText = useEventCallback((text: string) => {
    setAtom((prev) => {
      return produce(prev, (draft) => {
        draft.text = text
      })
    })
  })
  const store = useStore()
  const handleMarkdownChange = useEventCallback(setText)
  const milkdownRef = useRef<MilkdownRef>(null)

  useEffect(() => {
    jotaiStore.set(milkdownRefAtom, milkdownRef.current)
    return () => {
      jotaiStore.set(milkdownRefAtom, null)
    }
  }, [])

  return (
    <>
      <MenuBar />
      <div
        className={clsxm(
          'relative h-0 flex-grow overflow-auto rounded-xl border p-3 duration-200 focus-within:border-accent',
          'border-zinc-200 bg-white placeholder:text-slate-500 focus-visible:border-accent dark:border-neutral-800 dark:bg-zinc-900',
        )}
      >
        <MilkdownEditor
          ref={milkdownRef}
          onMarkdownChange={handleMarkdownChange}
          initialMarkdown={store.get(ctxAtom).text}
        />
      </div>
    </>
  )
}

const milkdownRefAtom = atom<MilkdownRef | null>(null)
export const useEditorRef = () => useAtomValue(milkdownRefAtom)
