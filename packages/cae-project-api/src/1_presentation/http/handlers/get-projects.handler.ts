import http from 'node:http'
import type { ICAEProjectRepository } from '@/3_domain/repositories/cae-project.repository.interface'

/**
 * GET /projects 엔드포인트를 처리하는 핸들러를 생성합니다.
 * @param repository - CAE 프로젝트 저장소 인터페이스
 * @returns HTTP 요청 핸들러 함수
 */
export function createGetProjectsHandler(repository: ICAEProjectRepository) {
  return (req: http.IncomingMessage, res: http.ServerResponse): void => {
    const allProjects = repository.getAllProjects()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(allProjects))
  }
}
