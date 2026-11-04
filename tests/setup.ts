import '@testing-library/jest-dom'

class MockRequest {
  constructor(input, init) {
    this.method = init?.method || 'GET'
    this.headers = new Map(Object.entries(init?.headers || {}))
    this.body = init?.body || null
    this.url = typeof input === 'string' ? input : input.url
    if (typeof init?.body === 'string') {
      try {
        this._json = JSON.parse(init.body)
      } catch {
        this._json = null
      }
    } else {
      this._json = null
    }
    this._formData = init?.body instanceof FormData ? init.body : null
  }

  async json() {
    return this._json
  }

  async formData() {
    if (this._formData) return this._formData
    return new FormData()
  }
}

class MockResponse {
  constructor(body, init) {
    this.status = init?.status || 200
    this.body = body
    this._headers = new Map(Object.entries(init?.headers || {}))
  }

  async json() {
    if (this.body instanceof Response) {
      return this.body.json()
    }
    return JSON.parse(this.body)
  }

  headers = {
    get: (name: string) => {
      const value = this._headers?.get(name)
      return value || null
    },
    set: (name: string, value: string) => {
      if (!this._headers) this._headers = new Map()
      this._headers.set(name, value)
    },
  }
}

global.Request = MockRequest as any
global.Response = MockResponse as any
global.TextEncoder = class TextEncoder {
  encode(input) {
    return new Uint8Array([...input].map(c => c.charCodeAt(0)))
  }
} as any
global.ReadableStream = class ReadableStream {
  constructor(underlyingSource) {
    this._underlyingSource = underlyingSource
  }
  getReader() {
    return {
      read: async () => {
        const { value, done } = await this._underlyingSource.start({
          pull: (controller) => {},
        })
        return { value, done }
      },
    }
  }
} as any

const originalBlob = global.Blob
global.Blob = class MockBlob extends originalBlob {
  async arrayBuffer() {
    return Buffer.from(this.data || []).buffer
  }
} as any

global.FormData = class MockFormData {
  constructor() {
    this._data = new Map()
  }
  append(name, value) {
    this._data.set(name, value)
  }
  get(name) {
    return this._data.get(name) || null
  }
  has(name) {
    return this._data.has(name)
  }
  delete(name) {
    this._data.delete(name)
  }
} as any