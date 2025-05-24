import http from 'node:http'
import { InMemoryTodoStore, type ITodoStore } from '@/todo.store'
import { createInMemoryDb, getSingletonDb } from '@/in-memory.db'
import type { IInMemoryDb } from '@/in-memory.db.interface'

// 요청 핸들러 팩토리 함수들
function createHandleGetTodos(store: ITodoStore) {
  return (req: http.IncomingMessage, res: http.ServerResponse): void => {
    const allTodos = store.getAllTodos()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(allTodos))
  }
}

function createHandlePostTodos(store: ITodoStore) {
  return (req: http.IncomingMessage, res: http.ServerResponse): void => {
    let requestBody = ''
    req.on('data', chunk => {
      requestBody += chunk.toString()
    })
    req.on('end', () => {
      try {
        const parsedBody = JSON.parse(requestBody) as { task?: string }
        const task = parsedBody.task

        if (!task || typeof task !== 'string' || task.trim() === '') {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(
            JSON.stringify({
              message: 'Task is required and must be a non-empty string',
            })
          )
          return
        }

        const newTodo = store.addTodo(task.trim())
        res.writeHead(201, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(newTodo))
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        if (error instanceof SyntaxError) {
          res.end(JSON.stringify({ message: 'Invalid JSON format' }))
        } else {
          res.end(
            JSON.stringify({ message: 'Unexpected error processing request' })
          )
        }
      }
    })
  }
}

function handleNotFound(
  req: http.IncomingMessage,
  res: http.ServerResponse
): void {
  res.writeHead(404, { 'Content-Type': 'text/plain' })
  res.end('Not Found')
}

/**
 * TODO API 서버를 생성합니다.
 * @param options - 서버 생성 옵션
 * @returns HTTP 서버 인스턴스
 */
export function createTodoServer(): http.Server {
  // DB 인스턴스 결정: 테스트용이면 새 인스턴스, 아니면 싱글턴
  const database: IInMemoryDb =
    process.env.NODE_ENV === 'test' ? createInMemoryDb() : getSingletonDb()

  // 의존성 주입: DB를 스토어에 주입
  const todoStore: ITodoStore = new InMemoryTodoStore(database)

  // HTTP 서버 생성 및 반환
  return http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/todos') {
      createHandleGetTodos(todoStore)(req, res)
    } else if (req.method === 'POST' && req.url === '/todos') {
      createHandlePostTodos(todoStore)(req, res)
    } else {
      handleNotFound(req, res)
    }
  })
}
