// src/todo-api/server.ts
import http from 'node:http'

// To-Do 항목의 타입을 정의합니다.
export interface Todo {
  id: number
  task: string
  completed: boolean
}

// 인메모리 "데이터베이스" 역할을 할 배열
export let todos: Todo[] = [] // 테스트에서 상태를 초기화하기 위해 export 합니다.
let nextId = 1 // 다음 To-Do 항목에 할당될 ID

/**
 * 테스트 환경에서 To-Do 목록과 ID를 초기화하는 함수입니다.
 * 각 테스트가 독립적인 환경에서 실행될 수 있도록 합니다.
 */
export const __resetTodos__ = (): void => {
  todos = []
  nextId = 1
}

// Node.js는 HTTP 요청이라는 이벤트가 발생할 때마다 이 콜백 함수를 호출하여 요청을 처리합니다. 각 요청은 독립적인 이벤트로 취급됩니다.
// libuv(API를 제공하는 라이브러리,FE에서 WebAPI같은 역할)를 통해 비동기 이벤트 기반 모델을 제공합니다.
const app = http.createServer(
  //requestListener
  (req, res) => {
    if (req.method === 'GET' && req.url === '/todos') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(todos))
    } else if (req.method === 'POST' && req.url === '/todos') {
      // 1. 요청 본문(body) 데이터 수신 준비
      let requestBody = ''

      // 'data' 이벤트: 요청 본문 데이터가 조각(chunk)으로 들어올 때마다 발생
      // req: http.IncomingMessage객체는 readable stream이므로 데이터가 조각으로 들어온다.
      // 큰 데이터를 한 번에 메모리에 올리지 않고 효율적으로 다룰 수 있게 합니다.
      req.on('data', chunk => {
        console.log(chunk)
        requestBody += chunk.toString() // Buffer를 문자열로 변환하여 추가
      })

      // 'end' 이벤트: 요청 본문 데이터를 모두 받은 후 발생
      req.on('end', () => {
        try {
          // 2. 수신한 데이터를 JSON으로 파싱
          const { task } = JSON.parse(requestBody) as { task?: string } // 타입 단언 추가

          // 3. 간단한 유효성 검사: task 내용이 있는지 확인
          if (!task || typeof task !== 'string' || task.trim() === '') {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(
              JSON.stringify({
                message: 'Task is required and must be a non-empty string',
              })
            )
            return
          }

          // 4. 새로운 To-Do 항목 생성
          const newTodo: Todo = {
            id: nextId++,
            task: task.trim(), // 앞뒤 공백 제거
            completed: false,
          }

          // 5. 생성된 항목을 todos 배열에 추가
          todos.push(newTodo)

          // 6. 성공 응답 (201 Created) 및 생성된 항목 반환
          res.writeHead(201, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify(newTodo))
        } catch (error) {
          // JSON 파싱 오류 또는 기타 예외 처리
          res.writeHead(400, { 'Content-Type': 'application/json' }) // Bad Request
          res.end(
            JSON.stringify({
              message: 'Invalid JSON format or unexpected error',
            })
          )
        }
      })
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not Found - 실제 서버')
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
