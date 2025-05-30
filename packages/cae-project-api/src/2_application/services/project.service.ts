import type { ICAEProjectRepository } from '@/3_domain/repositories/cae-project.repository.interface'
import type {
  CreateProjectCommand,
  CreateProjectResult,
} from '@/2_application/dto/project.commands'
import { InvalidProjectDataError } from '@/3_domain/project.errors' // 위에서 정의한 에러
import { createCAEProject } from '@/3_domain/factories/cae-project.factory' // Import the factory

export class ProjectApplicationService {
  // 리포지토리는 생성자를 통해 주입받습니다 (Dependency Injection)
  constructor(private readonly projectRepository: ICAEProjectRepository) {}

  /**
   * 새로운 CAE 프로젝트를 생성합니다.
   * @param command - 프로젝트 생성에 필요한 데이터가 담긴 커맨드 객체
   * @returns 생성된 프로젝트 정보
   * @throws InvalidProjectDataError - 입력 데이터 유효성 검사 실패 시
   */
  async createProject(
    command: CreateProjectCommand
  ): Promise<CreateProjectResult> {
    // 1. 입력 데이터 유효성 검사 (이전에 핸들러에 있던 로직)
    const validationErrors: string[] = []
    if (
      !command.name ||
      typeof command.name !== 'string' ||
      command.name.trim() === ''
    ) {
      validationErrors.push('Name is required and must be a non-empty string.')
    }
    if (!command.description || typeof command.description !== 'string') {
      validationErrors.push('Description is required and must be a string.')
    }
    if (
      !command.type ||
      !['structural', 'fluid', 'thermal', 'coupled'].includes(command.type)
    ) {
      validationErrors.push(
        'Type is required and must be one of: structural, fluid, thermal, coupled.'
      )
    }

    if (validationErrors.length > 0) {
      // 유효성 검사 오류가 하나라도 있으면 예외 발생
      throw new InvalidProjectDataError(validationErrors)
    }

    // 2. Use the factory to create the project entity
    const projectEntity = createCAEProject({
      name: command.name.trim(), // Ensure name is trimmed as per original logic in service
      description: command.description,
      type: command.type,
    })

    // 3. 리포지토리를 통해 프로젝트 생성 요청
    const newProject = this.projectRepository.addProject(projectEntity)

    // 3. 결과 반환
    // 여기서는 생성된 프로젝트 객체를 그대로 반환합니다.
    // 필요에 따라 응답 DTO로 변환하여 반환할 수도 있습니다.
    return newProject
  }

  // 여기에 다른 프로젝트 관련 애플리케이션 서비스 메소드들이 추가될 수 있습니다.
  // 예: async getProjectById(id: number): Promise<CAEProject | null> { ... }
  // 예: async updateProjectDescription(command: UpdateDescriptionCommand): Promise<void> { ... }
}
