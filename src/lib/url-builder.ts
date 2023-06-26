import { aggregationDataAtom } from '~/providers/root/aggregation-data-provider'
import { isDev } from '~/utils/env'

import { jotaiStore } from './store'

export function urlBuilder(path = '') {
  if (isDev) return new URL(path, 'http://localhost:2323')
  return new URL(path, jotaiStore.get(aggregationDataAtom)?.url.webUrl)
}
