// src/todo-api/server.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import http from 'node:http'
import type { AddressInfo } from 'node:net'
import fetch from 'node-fetch' // 또는 사용 중인 HTTP 클라이언트

// server.ts 에서 app과 테스트용 유틸리티 함수를 가져옵니다.
import { app, __resetTodos__, Todo } from './server'

describe('To-Do API', () => {
  let server: http.Server
  let serverUrl: string

  beforeAll(async () => {
    await new Promise<void>(resolve => {
      server = app.listen(0, () => {
        const address = server.address() as AddressInfo
        serverUrl = `http://localhost:${address.port}`
        resolve()
      })
    })
  })

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close(err => {
        if (err) return reject(err)
        resolve()
      })
    })
  })

  // 각 테스트 실행 전에 To-Do 데이터를 초기화합니다.
  beforeEach(() => {
    __resetTodos__()
  })

  describe('GET /todos', () => {
    it('should respond with 200 OK and an empty array when no todos exist', async () => {
      const response = await fetch(`${serverUrl}/todos`)
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body).toEqual([]) // __resetTodos__ 덕분에 항상 빈 배열로 시작
    })
  })

  describe('POST /todos', () => {
    it('should create a new todo item and return it with an ID and completed:false', async () => {
      const newTaskPayload = { task: 'TDD 배우기' }

      const response = await fetch(`${serverUrl}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTaskPayload),
      })

      // 1. 상태 코드가 201 Created 인지 확인
      expect(response.status).toBe(201)

      // 2. 응답 본문이 올바른지 확인
      const createdTodo = (await response.json()) as Todo
      expect(createdTodo).toEqual(
        expect.objectContaining({
          id: expect.any(Number), // id는 숫자 타입이어야 함
          task: newTaskPayload.task,
          completed: false, // 기본값은 false
        })
      )
      // 첫 번째로 생성된 아이템의 ID가 1인지 확인 (선택적이지만 명확성을 위해)
      if (createdTodo.id !== undefined) {
        // 타입스크립트 null check
        expect(createdTodo.id).toBe(1)
      }
    })

    it('should add the new todo to the list retrieved by GET /todos', async () => {
      const newTaskPayload = { task: '테스트 코드 작성하기' }

      // 1. 새로운 To-Do 항목 생성
      const postResponse = await fetch(`${serverUrl}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTaskPayload),
      })
      expect(postResponse.status).toBe(201) // 생성 성공 확인

      // 2. GET /todos로 전체 목록 조회
      const getResponse = await fetch(`${serverUrl}/todos`)
      const todosList = (await getResponse.json()) as Todo[]

      // 3. 목록에 방금 추가한 항목이 포함되어 있는지, 올바른 내용인지 확인
      expect(todosList.length).toBe(1)
      expect(todosList[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          task: newTaskPayload.task,
          completed: false,
        })
      )
    })

    // (선택 사항) 유효성 검사 테스트 (나중에 추가 가능)
    // it('should return 400 Bad Request if task is missing', async () => { /* ... */ })
  })
})
