import http from 'node:http'
import {
  InMemoryCAEProjectRepository,
  createInMemoryDb,
  getSingletonDb,
  type IInMemoryDb,
} from '@/4_Persistence/persistence/index'
import type { ICAEProjectRepository } from '@/3_domain/repositories/cae-project.repository.interface'
import { createGetProjectsHandler } from '@/1_presentation/http/handlers/get-projects.handler'
import { createPostProjectsHandler } from '@/1_presentation/http/handlers/post-projects.handler'
import { handleNotFound } from '@/1_presentation/http/handlers/not-found.handler'
import { ProjectApplicationService } from '@/2_application/services/project.service'

/**
 * CAE 프로젝트 HTTP 서버를 생성합니다.
 * 의존성 주입을 통해 데이터베이스와 저장소를 주입받습니다.
 * @returns HTTP 서버 인스턴스
 */
export function createCAEProjectServer(): http.Server {
  // DB 인스턴스 결정: 테스트용이면 새 인스턴스, 아니면 싱글턴
  const database: IInMemoryDb =
    process.env.NODE_ENV === 'test' ? createInMemoryDb() : getSingletonDb()

  // 의존성 주입: DB를 저장소에 주입
  const projectRepository: ICAEProjectRepository =
    new InMemoryCAEProjectRepository(database)

  // 애플리케이션 서비스 생성
  const projectService = new ProjectApplicationService(projectRepository)

  // 핸들러들 생성
  const getProjectsHandler = createGetProjectsHandler(projectRepository)
  const postProjectsHandler = createPostProjectsHandler(projectService)

  // HTTP 서버 생성 및 반환
  return http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/projects') {
      getProjectsHandler(req, res)
    } else if (req.method === 'POST' && req.url === '/projects') {
      postProjectsHandler(req, res)
    } else {
      handleNotFound(req, res)
    }
  })
}
