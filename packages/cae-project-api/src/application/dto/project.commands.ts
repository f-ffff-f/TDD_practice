import type { CAEProject } from '@/domain/entities/cae-project.types'

/**
 * 프로젝트 생성을 위한 커맨드 객체 인터페이스입니다.
 * HTTP 핸들러로부터 전달받아 애플리케이션 서비스에서 사용됩니다.
 */
export interface CreateProjectCommand {
  name: string
  description: string
  type: CAEProject['type']
}

/**
 * 애플리케이션 서비스의 작업 결과를 나타내는 DTO입니다.
 * 여기서는 생성된 프로젝트 정보를 그대로 반환한다고 가정합니다.
 * ????????????
 */
export type CreateProjectResult = CAEProject
