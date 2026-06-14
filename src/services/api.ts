export interface ApiClient {
  get<T>(path: string): Promise<T>
  post<T, B = unknown>(path: string, body: B): Promise<T>
}

export class MockApiClient implements ApiClient {
  async get<T>(path: string): Promise<T> {
    return Promise.reject(new Error(`Endpoint GET não implementado: ${path}`))
  }

  async post<T, B>(path: string, body: B): Promise<T> {
    void body
    return Promise.reject(new Error(`Endpoint POST não implementado: ${path}`))
  }
}

export const apiClient: ApiClient = new MockApiClient()
