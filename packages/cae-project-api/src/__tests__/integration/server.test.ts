import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import http from 'node:http'
import type { AddressInfo } from 'node:net'
import fetch, { type Response } from 'node-fetch'
import { CAEProject } from '@/domain/entities/cae-project.types'
import { createCAEProjectServer } from '@/presentation/http/server.factory'

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

  describe('POST /projects', () => {
    it('should create a new CAE project and return it with correct properties', async () => {
      const newProjectPayload = {
        name: 'Aircraft Wing Analysis',
        description:
          'Structural analysis of Boeing 737 wing under flutter conditions',
        type: 'structural' as const,
      }

      const response: Response = await fetch(`${serverUrl}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProjectPayload),
      })

      const createdProject = (await response.json()) as CAEProject

      expect(response.status).toBe(201)
      expect(createdProject.id).toEqual(expect.any(Number))
      expect(createdProject.name).toBe(newProjectPayload.name)
      expect(createdProject.description).toBe(newProjectPayload.description)
      expect(createdProject.type).toBe(newProjectPayload.type)
      expect(createdProject.status).toBe('created') // 기본 상태
      expect(new Date(createdProject.createdAt)).toEqual(expect.any(Date))
      expect(new Date(createdProject.updatedAt)).toEqual(expect.any(Date))

      // 새로운 DB 인스턴스이므로 첫 ID는 항상 1이어야 함
      expect(createdProject.id).toBe(1)
    })
  })
})
