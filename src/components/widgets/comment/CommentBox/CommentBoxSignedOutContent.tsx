'use client'

import { usePathname } from 'next/navigation'

import { SignInButton } from '@clerk/nextjs'

import { UserArrowLeftIcon } from '~/components/icons/user-arrow-left'
import { StyledButton } from '~/components/ui/button'
import { urlBuilder } from '~/lib/url-builder'

import { inputStyles } from './inputStyles'

export function CommentBoxSignedOutContent() {
  const pathname = usePathname()

  return (
    <SignInButton mode="modal" redirectUrl={urlBuilder(pathname).href}>
      <div
        className={inputStyles({
          type: 'auth',
        })}
      >
        <StyledButton variant="secondary" type="button">
          <UserArrowLeftIcon className="mr-1 h-5 w-5" />
          登录后才可以留言噢
        </StyledButton>
      </div>
    </SignInButton>
  )
}
