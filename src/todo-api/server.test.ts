import http from 'node:http'
import type { AddressInfo } from 'node:net'
import fetch from 'node-fetch'
import { app } from './server'

describe('To-Do API Server - GET /todos', () => {
  let server: http.Server
  let serverUrl: string

  beforeAll(async () => {
    // // 임시 서버 생성
    // const tempApp = http.createServer((req, res) => {
    //   // 이 핸들러는 실제 server.ts에 구현될 것입니다.
    //   // 현재는 server.ts가 비어있거나 /todos 경로가 없으므로,
    //   // 이 테스트는 실제 server.ts를 사용하기 시작하면 실패할 것입니다.
    //   if (req.method === 'GET' && req.url === '/todos') {
    //     res.writeHead(501, { 'Content-Type': 'application/json' })
    //     res.end(JSON.stringify({ message: 'Not Implemented Yet for tempApp' }))
    //   } else {
    //     res.writeHead(404).end()
    //   }
    // })

    // 임시 서버 시작
    await new Promise<void>(resolve => {
      server = app.listen(0, () => {
        // 0 포트는 사용 가능한 랜덤 포트를 할당합니다.
        const address = server.address() as AddressInfo
        serverUrl = `http://localhost:${address.port}`
        resolve()
      })
    })
  })

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close(err => {
        if (err) reject(err)
        else resolve()
      })
    })
  })

  it('should respond with 200 OK and an empty array when no todos exist', async () => {
    // 아래 fetch는 위 beforeAll의 tempApp을 호출합니다.
    // 실제 server.ts를 import해서 사용하게 되면 해당 서버를 호출합니다.

    // 명시적으로 method를 지정하지 않으면 GET 요청이 기본으로 전송됩니다.
    const res = await fetch(`${serverUrl}/todos`)

    let body

    try {
      body = await res.json()
    } catch (e) {
      body = null
    }

    expect(res.status).toBe(200)
    expect(body).toEqual([])
  })
})
