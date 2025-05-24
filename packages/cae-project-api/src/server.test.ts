import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import http from 'node:http'
import type { AddressInfo } from 'node:net'
import fetch, { type Response } from 'node-fetch'
import { CAEProject } from '@/cae-project.types'
import { createCAEProjectServer } from '@/server.factory'

describe('CAE Project API', () => {
  let server: http.Server
  let serverUrl: string

  beforeEach(async () => {
    server = createCAEProjectServer()

    // 서버 실행
    await new Promise<void>(resolve => {
      server.listen(0, () => {
        const address = server.address() as AddressInfo
        serverUrl = `http://localhost:${address.port}`
        resolve()
      })
    })
  })

  afterEach(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close(err => {
        if (err) return reject(err)
        resolve()
      })
    })
  })

  it('should respond with 200 OK and an empty array when no projects exist', async () => {
    const response: Response = await fetch(`${serverUrl}/projects`)
    const body = (await response.json()) as CAEProject[]

    expect(response.status).toBe(200)
    expect(body).toEqual([])
  })
})
