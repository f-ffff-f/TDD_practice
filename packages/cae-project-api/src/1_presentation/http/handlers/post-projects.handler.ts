import http from 'node:http'
import { CreateCAEProjectRequest } from '@/1_presentation/dto/cae-project.dto'
import { ProjectApplicationService } from '@/2_application/services/project.service'
import { CreateProjectCommand } from '@/2_application/dto/project.commands'

/**
 * POST /projects 엔드포인트를 처리하는 핸들러를 생성합니다.
 * @param projectService - 프로젝트 애플리케이션 서비스
 * @returns HTTP 요청 핸들러 함수
 */
export function createPostProjectsHandler(
  projectService: ProjectApplicationService
) {
  return (req: http.IncomingMessage, res: http.ServerResponse): void => {
    let requestBody = ''
    req.on('data', chunk => {
      requestBody += chunk.toString()
    })
    req.on('end', async () => {
      try {
        const parsedBody = JSON.parse(requestBody) as CreateCAEProjectRequest

        const command: CreateProjectCommand = {
          name: parsedBody.name,
          description: parsedBody.description,
          type: parsedBody.type,
        }

        const newProject = await projectService.createProject(command)
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
