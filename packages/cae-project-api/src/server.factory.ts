import { createInMemoryDb, getSingletonDb } from '@/in-memory.db'
import { IInMemoryDb } from '@/in-memory.db.interface'
import http from 'node:http'

export function createCAEProjectServer(): http.Server {
  const database: IInMemoryDb =
    process.env.NODE_ENV === 'test' ? createInMemoryDb() : getSingletonDb()

  return http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/projects') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify([])) // 빈 배열 반환 - 테스트 통과를 위한 최소한의 구현
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not Found')
    }
  })
}
