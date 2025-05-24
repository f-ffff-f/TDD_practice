import type { CAEProject } from '@/3_domain/entities/cae-project.interface'

/**
 * 프로젝트 생성을 위한 커맨드 객체 인터페이스입니다.
 * HTTP 핸들러로부터 전달받아 애플리케이션 서비스에서 사용됩니다
 * DTO와 똑같은 내용이지만 바깥 레이어의 객체를 참조하면 안됩니다. 이건 API DTO와 상관없는 서비스에 쓰이는 인터페이스.
 * 불필요한 결합 없이 명시적으로 정의합니다.
 */
export interface CreateProjectCommand {
  name: string
  description: string
  type: CAEProject['type']
}

/**
 * 애플리케이션 서비스의 작업 결과를 나타내는 DTO입니다.
 * 명시적인 서비스 계약을 위해 사용됩니다.
 * 추상화 계층을 가짐으로써 훗날 발생할 수 있는 변경에 유연하게 대응할 수 있습니다.
 */
export type CreateProjectResult = CAEProject
