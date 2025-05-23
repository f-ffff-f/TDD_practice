// src/todo-api/server.ts
import http from 'node:http'

// To-Do 항목의 타입을 정의합니다.
export interface Todo {
  id: number
  task: string
  completed: boolean
}

// 인메모리 "데이터베이스" 역할을 할 배열
let todos: Todo[] = []
let nextId = 1

export const __resetTodos__ = (): void => {
  todos = []
  nextId = 1
}

function handleGetTodos(req: http.IncomingMessage, res: http.ServerResponse) {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(todos))
}

// POST /todos 요청 처리 함수
function handlePostTodos(
  req: http.IncomingMessage,
  res: http.ServerResponse
): void {
  let requestBody = ''
  req.on('data', chunk => {
    requestBody += chunk.toString()
  })
  req.on('end', () => {
    try {
      const { task } = JSON.parse(requestBody) as { task?: string }
      if (!task || typeof task !== 'string' || task.trim() === '') {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(
          JSON.stringify({
            message: 'Task is required and must be a non-empty string',
          })
        )
        return
      }
      const newTodo: Todo = {
        id: nextId++,
        task: task.trim(),
        completed: false,
      }
      todos.push(newTodo)
      res.writeHead(201, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(newTodo))
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({ message: 'Invalid JSON format or unexpected error' })
      )
    }
  })
}

function handleNotFound(
  req: http.IncomingMessage,
  res: http.ServerResponse
): void {
  res.writeHead(404, { 'Content-Type': 'text/plain' })
  res.end('Not Found - 실제 서버')
}

const app = http.createServer(
  //requestListener
  (req, res) => {
    if (req.method === 'GET' && req.url === '/todos') {
      handleGetTodos(req, res)
    } else if (req.method === 'POST' && req.url === '/todos') {
      handlePostTodos(req, res)
    } else {
      handleNotFound(req, res)
    }
  }
)

export { app }

// 이 파일이 직접 실행될 때만 서버를 시작 (e.g., pnpm tsx src/todo-api/server.ts)
// vitest 같은 테스트 러너는 app을 import 해서 자체적으로 실행하므로,
// 아래 코드는 일반적인 개발/프로덕션 실행 시에만 동작하도록 조건 처리하는 것이 좋습니다.

if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`)
  })
}
