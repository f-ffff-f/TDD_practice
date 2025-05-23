// src/todo-api/server.ts
import http from 'node:http'

// Node.js는 HTTP 요청이라는 이벤트가 발생할 때마다 이 콜백 함수를 호출하여 요청을 처리합니다. 각 요청은 독립적인 이벤트로 취급됩니다.
// libuv(API를 제공하는 라이브러리,FE에서 WebAPI같은 역할)를 통해 비동기 이벤트 기반 모델을 제공합니다.
const app = http.createServer(
  // 이 콜백은 이벤트가 발생했을 때 이벤트 큐에서 대기하고 콜스택이 비었을 때 이벤트루프는 이 콜백을 콜스택으로 가져온다.
  (req, res) => {
    // 요청 URL과 메소드를 확인합니다.
    if (req.method === 'GET' && req.url === '/todos') {
      // HTTP 헤더 설정: 상태 코드 200, Content-Type은 application/json
      res.writeHead(200, { 'Content-Type': 'application/json' })
      // 응답 본문: 빈 배열을 JSON 문자열로 변환하여 전송
      res.end(JSON.stringify([]))
    } else {
      // 그 외의 모든 요청은 404 Not Found로 응답
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not Found - 실제 서버')
    }
  }
)

// 서버 인스턴스를 export하여 테스트 파일에서 import하여 사용합니다.
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
