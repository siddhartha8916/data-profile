/* eslint-disable @typescript-eslint/no-explicit-any */
enum CachePriority {
  Low = 1,
  Normal = 2,
  High = 4
}

interface CacheItemOptions {
  expirationAbsolute?: number
  expirationSliding?: number
  priority?: number
  callback?: (key: string, value: any) => void
}

class Cache {
  private items: { [key: string]: CacheItem } = {}
  private count: number = 0
  private readonly maxSize: number
  private fillFactor: number = 0.75
  private readonly purgeSize: number

  constructor(maxSize?: number) {
    this.maxSize = maxSize ?? -1
    this.purgeSize = Math.round(this.maxSize * this.fillFactor)
  }

  getItem(key: string): any | null {
    const item = this.items[key]

    if (item !== undefined) {
      if (!this._isExpired(item)) {
        item.lastAccessed = new Date().getTime()
      } else {
        this._removeItem(key)
        return null
      }
    }

    if (item !== undefined) {
      return item.value
    } else {
      return null
    }
  }

  setItem(key: string, value: any, options?: CacheItemOptions): void {
    if (this.items[key] !== undefined) {
      this._removeItem(key)
    }

    const cacheItem: CacheItem = {
      key,
      value,
      options: options ?? {},
      lastAccessed: new Date().getTime(),
      createdAt: new Date().getTime() // Add a new property
    }

    this._addItem(cacheItem)

    if (this.maxSize > 0 && this.count > this.maxSize) {
      this._purge()
    }
  }

  clearItem(key: string): void {
    this._removeItem(key)
  }

  clear(): void {
    for (const key in this.items) {
      this._removeItem(key)
    }
  }

  clearStartingWith(prefix: string): void {
    for (const key in this.items) {
      if (key.startsWith(prefix)) {
        this._removeItem(key)
      }
    }
  }

  private _purge(): void {
    const tmparray: CacheItem[] = []

    for (const key in this.items) {
      const item = this.items[key]
      if (this._isExpired(item)) {
        this._removeItem(key)
      } else {
        tmparray.push(item)
      }
    }

    if (tmparray.length > this.purgeSize) {
      tmparray.sort((a, b) => {
        const priorityA = a.options.priority ?? CachePriority.Normal
        const priorityB = b.options.priority ?? CachePriority.Normal

        if (priorityA !== priorityB) {
          return priorityB - priorityA
        } else {
          return b.lastAccessed - a.lastAccessed
        }
      })

      while (tmparray.length > this.purgeSize) {
        const ritem = tmparray.pop()
        if (ritem !== undefined) {
          this._removeItem(ritem.key)
        }
      }
    }
  }

  private _addItem(item: CacheItem): void {
    this.items[item.key] = item
    this.count++
  }

  private _removeItem(key: string): void {
    const item = this.items[key]
    if (item !== undefined) {
      delete this.items[key]
      this.count--

      if (item.options.callback) {
        setTimeout(() => {
          item.options.callback?.(item.key, item.value)
        }, 0)
      }
    }
  }

  //   private _isExpired(item: CacheItem): boolean {
  //     const now = new Date().getTime()
  //     let expired = false

  //     if (item.options.expirationAbsolute !== undefined && item.options.expirationAbsolute < now) {
  //       expired = true
  //     }

  //     if (!expired && item.options.expirationSliding !== undefined) {
  //       const lastAccess = item.lastAccessed + item.options.expirationSliding * 1000
  //       if (lastAccess < now) {
  //         expired = true
  //       }
  //     }

  //     return expired
  //   }

  private _isExpired(item: CacheItem): boolean {
    const now = new Date().getTime()
    const createdAt = item.createdAt ?? 0 // Get the createdAt time
    let expired = false

    if (item.options.expirationAbsolute !== undefined && item.options.expirationAbsolute < now) {
      expired = true
    }

    if (!expired && item.options.expirationSliding !== undefined) {
      const expirationTime = createdAt + item.options.expirationSliding * 1000
      if (expirationTime < now) {
        expired = true
      }
    }

    return expired
  }

  toHtmlString(): string {
    let returnStr = `${this.count} item(s) in cache<br /><ul>`

    for (const key in this.items) {
      const item = this.items[key]
      returnStr += `<li>${item.key.toString()} = ${item.value.toString()}</li>`
    }

    returnStr += '</ul>'
    return returnStr
  }
}

interface CacheItem {
  key: string
  value: any
  options: CacheItemOptions
  lastAccessed: number
  createdAt: number
}

const appCache = new Cache(1000)

export { appCache, CachePriority }
