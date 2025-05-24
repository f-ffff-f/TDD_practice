// src/todo-api/server.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import http from 'node:http'
import type { AddressInfo } from 'node:net'
import fetch, { type Response } from 'node-fetch'
import { createTodoServer } from './server.factory.js'
import type { Todo } from './todo.store.interface.js'

describe('To-Do API with Isolated Test Instances', () => {
  let server: http.Server
  let serverUrl: string

  beforeEach(async () => {
    // 각 테스트마다 완전히 새로운 서버 인스턴스 생성
    server = createTodoServer()

    await new Promise<void>(resolve => {
      server.listen(0, () => {
        // 사용 가능한 랜덤 포트 사용
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

  describe('GET /todos', () => {
    it('should respond with 200 OK and an empty array when no todos exist', async () => {
      const response: Response = await fetch(`${serverUrl}/todos`)
      const body = (await response.json()) as Todo[]

      expect(response.status).toBe(200)
      expect(body).toEqual([])
    })

    it('should return todos after they are added via API', async () => {
      // 첫 번째 TODO 추가
      const task1Payload = { task: 'First task for GET' }
      const postRes1 = await fetch(`${serverUrl}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task1Payload),
      })
      expect(postRes1.status).toBe(201)
      const createdTodo1 = (await postRes1.json()) as Todo

      // 두 번째 TODO 추가
      const task2Payload = { task: 'Second task for GET' }
      const postRes2 = await fetch(`${serverUrl}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task2Payload),
      })
      expect(postRes2.status).toBe(201)
      const createdTodo2 = (await postRes2.json()) as Todo

      // GET 요청으로 추가된 TODO들 확인
      const getRes: Response = await fetch(`${serverUrl}/todos`)
      const todosList = (await getRes.json()) as Todo[]

      expect(getRes.status).toBe(200)
      expect(todosList.length).toBe(2)
      expect(todosList).toEqual(
        expect.arrayContaining([
          expect.objectContaining(createdTodo1),
          expect.objectContaining(createdTodo2),
        ])
      )
    })
  })

  describe('POST /todos', () => {
    it('should create a new todo item and return it with correct properties', async () => {
      const newTaskPayload = { task: 'Learn Dependency Injection' }

      const response: Response = await fetch(`${serverUrl}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTaskPayload),
      })
      const createdTodo = (await response.json()) as Todo

      expect(response.status).toBe(201)
      expect(createdTodo.id).toEqual(expect.any(Number))
      expect(createdTodo.task).toBe(newTaskPayload.task)
      expect(createdTodo.completed).toBe(false)

      // 새로운 DB 인스턴스이므로 첫 ID는 항상 1이어야 함
      expect(createdTodo.id).toBe(1)
    })

    it('should increment IDs for multiple todos', async () => {
      const task1 = { task: 'First task' }
      const task2 = { task: 'Second task' }

      const response1 = await fetch(`${serverUrl}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task1),
      })
      const todo1 = (await response1.json()) as Todo

      const response2 = await fetch(`${serverUrl}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task2),
      })
      const todo2 = (await response2.json()) as Todo

      expect(todo1.id).toBe(1)
      expect(todo2.id).toBe(2)
    })

    it('should return 400 Bad Request if task is missing', async () => {
      const invalidPayload = {
        /* task 필드 없음 */
      }

      const response: Response = await fetch(`${serverUrl}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidPayload),
      })
      const body = (await response.json()) as { message: string }

      expect(response.status).toBe(400)
      expect(body.message).toContain('Task is required')
    })

    it('should return 400 Bad Request if task is empty string', async () => {
      const emptyTaskPayload = { task: '   ' } // 공백만 있는 문자열

      const response: Response = await fetch(`${serverUrl}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emptyTaskPayload),
      })
      const body = (await response.json()) as { message: string }

      expect(response.status).toBe(400)
      expect(body.message).toContain('Task is required')
    })

    it('should return 400 Bad Request for invalid JSON payload', async () => {
      const invalidJsonPayload = '{"task": "Incomplete JSON'

      const response: Response = await fetch(`${serverUrl}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: invalidJsonPayload,
      })
      const body = (await response.json()) as { message: string }

      expect(response.status).toBe(400)
      expect(body.message).toContain('Invalid JSON format')
    })
  })

  describe('Integration: POST then GET workflow', () => {
    it('should persist todos across different HTTP requests', async () => {
      // 1. POST로 todo 생성
      const createResponse = await fetch(`${serverUrl}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'Test persistence' }),
      })
      expect(createResponse.status).toBe(201)
      const createdTodo = (await createResponse.json()) as Todo

      // 2. GET으로 생성된 todo가 실제로 저장되었는지 확인
      const getResponse = await fetch(`${serverUrl}/todos`)
      const todos = (await getResponse.json()) as Todo[]

      expect(getResponse.status).toBe(200)
      expect(todos).toHaveLength(1)
      expect(todos[0]).toEqual(createdTodo)
    })

    it('should handle multiple todos creation and retrieval', async () => {
      const tasks = ['Task 1', 'Task 2', 'Task 3']
      const createdTodos: Todo[] = []

      // 여러 TODO 생성
      for (const task of tasks) {
        const response = await fetch(`${serverUrl}/todos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task }),
        })
        expect(response.status).toBe(201)
        const todo = (await response.json()) as Todo
        createdTodos.push(todo)
      }

      // 모든 TODO 조회
      const getResponse = await fetch(`${serverUrl}/todos`)
      const retrievedTodos = (await getResponse.json()) as Todo[]

      expect(retrievedTodos).toHaveLength(3)
      expect(retrievedTodos).toEqual(expect.arrayContaining(createdTodos))
    })
  })

  describe('404 Not Found', () => {
    it('should return 404 for unknown endpoints', async () => {
      const response = await fetch(`${serverUrl}/unknown-endpoint`)

      expect(response.status).toBe(404)
      const text = await response.text()
      expect(text).toBe('Not Found')
    })

    it('should return 404 for unsupported methods', async () => {
      const response = await fetch(`${serverUrl}/todos`, {
        method: 'DELETE', // 지원하지 않는 메서드
      })

      expect(response.status).toBe(404)
    })
  })
})
