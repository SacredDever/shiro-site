import { useQuery } from '@tanstack/react-query'
import type { SubscribeTypeToBitMap } from '@mx-space/api-client'

import { useModalStack } from '~/providers/root/modal-stack-provider'
import { apiClient } from '~/utils/request'

import { SubscribeModal } from './SubscribeModal'

const QUERY_CHECK_SUBSCRIBE_KEY = ['subscribe-status']

export const useSubscribeStatusQuery = () => {
  return useQuery(QUERY_CHECK_SUBSCRIBE_KEY, apiClient.subscribe.check, {
    cacheTime: 60_000 * 10,
  })
}

export const useIsEnableSubscribe = () =>
  useQuery({
    queryKey: QUERY_CHECK_SUBSCRIBE_KEY,
    queryFn: apiClient.subscribe.check,
    select: (data: { enable: boolean }) => data?.enable,
    cacheTime: 60_000 * 10,
    staleTime: 60_000 * 10,
    meta: {
      persist: false,
    },
  })

export const usePresentSubscribeModal = (
  defaultTypes?: (keyof typeof SubscribeTypeToBitMap)[],
) => {
  const { present } = useModalStack()

  return {
    present: () => {
      const dispose = present({
        title: '邮件订阅',

        content: () => (
          <SubscribeModal onConfirm={dispose} defaultTypes={defaultTypes} />
        ),
      })
    },
  }
}
