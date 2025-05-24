import http from 'node:http'
import {
  InMemoryCAEProjectStore,
  type ICAEProjectStore,
} from '@/cae-project.store.js'
import { createInMemoryDb, getSingletonDb } from '@/in-memory.db.js'
import type { IInMemoryDb } from '@/in-memory.db.interface.js'

// 요청 핸들러 팩토리 함수들
function createHandleGetProjects(store: ICAEProjectStore) {
  return (req: http.IncomingMessage, res: http.ServerResponse): void => {
    const allProjects = store.getAllProjects()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(allProjects))
  }
}

function createHandlePostProjects(store: ICAEProjectStore) {
  return (req: http.IncomingMessage, res: http.ServerResponse): void => {
    let requestBody = ''
    req.on('data', chunk => {
      requestBody += chunk.toString()
    })
    req.on('end', () => {
      try {
        const parsedBody = JSON.parse(requestBody) as {
          name?: string
          description?: string
          type?: string
        }

        if (
          !parsedBody.name ||
          typeof parsedBody.name !== 'string' ||
          parsedBody.name.trim() === ''
        ) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(
            JSON.stringify({
              message: 'Name is required and must be a non-empty string',
            })
          )
          return
        }

        if (
          !parsedBody.description ||
          typeof parsedBody.description !== 'string'
        ) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(
            JSON.stringify({
              message: 'Description is required and must be a string',
            })
          )
          return
        }

        if (
          !parsedBody.type ||
          !['structural', 'fluid', 'thermal', 'coupled'].includes(
            parsedBody.type
          )
        ) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(
            JSON.stringify({
              message:
                'Type is required and must be one of: structural, fluid, thermal, coupled',
            })
          )
          return
        }

        const newProject = store.addProject(
          parsedBody.name.trim(),
          parsedBody.description,
          parsedBody.type as any
        )
        res.writeHead(201, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(newProject))
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

export function createCAEProjectServer(): http.Server {
  // DB 인스턴스 결정: 테스트용이면 새 인스턴스, 아니면 싱글턴
  const database: IInMemoryDb =
    process.env.NODE_ENV === 'test' ? createInMemoryDb() : getSingletonDb()

  // 의존성 주입: DB를 스토어에 주입
  const projectStore: ICAEProjectStore = new InMemoryCAEProjectStore(database)

  // HTTP 서버 생성 및 반환
  return http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/projects') {
      createHandleGetProjects(projectStore)(req, res)
    } else if (req.method === 'POST' && req.url === '/projects') {
      createHandlePostProjects(projectStore)(req, res)
    } else {
      handleNotFound(req, res)
    }
  })
}
