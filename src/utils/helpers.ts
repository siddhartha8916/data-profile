import { TPages } from '../types/app'

export function constructPagesObject(itemCount: number, page: number, perPage: number): TPages {
  const pageCount = Math.ceil(itemCount / perPage)
  const offset = (page - 1) * perPage
  const hasNextPage = page < pageCount
  const hasPrevPage = page > 1

  const nextPage = hasNextPage ? page + 1 : null
  const prevPage = hasPrevPage ? page - 1 : null

  return {
    itemCount,
    offset,
    perPage,
    page,
    next: nextPage,
    prev: prevPage,
    hasNextPage,
    hasPrevPage,
    pageCount
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function logWithTimestamp(...args: any[]): void {
  const currentTimestamp: string = new Date().toISOString()
  console.log(`${currentTimestamp} :`, ...args)
}

export async function handleAsyncOperation<T>(asyncOperation: () => Promise<T>): Promise<T | null> {
  try {
    return await asyncOperation()
  } catch (error) {
    console.error('Error occurred:', error)
    // You can handle the error further if needed, such as logging or notifying.
    return null
  }
}
