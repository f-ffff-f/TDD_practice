// import {
//   CreateProjectCommand,
//   CreateProjectResult,
// } from '@/2_application/dto/project.commands'
import type { CAEProject } from '@/3_domain/entities/cae-project.interface'

/**
 * ------------------------------architecture layer 의존성 흐름 어긴 사례
 */
// export interface ICAEProjectRepository {
//   getAllProjects(): CAEProject[]
//
// 여기서 어김
//   addProject(command: CreateProjectCommand): CreateProjectResult
//   // 향후 확장 가능한 메서드들
//   // getProjectById(id: number): CAEProject | undefined
//   // updateProject(id: number, updates: Partial<CAEProject>): CAEProject | undefined
//   // deleteProject(id: number): boolean
// }
/**
 * ------------------------------------------------------------
 */

// 안쪽 계층(domain layer)은 바깥쪽 계층(application layer)에 의존하지 않는다.
// 의존관계 역전. Domain layer가 원래의 의존방향을 역전하여 자기 자신이 정의한 인터페이스를 Persistence layer가 구현하게 하고 자기자신은 Persistence layer의 구현에 의존하지 않음(둘 다 서로의 구현을 전혀 알지 못함).
export interface ICAEProjectRepository {
  getAllProjects(): CAEProject[]
  addProject(command: {
    name: string
    description: string
    type: CAEProject['type']
  }): CAEProject
  // 향후 확장 가능한 메서드들
  // getProjectById(id: number): CAEProject | undefined
  // updateProject(id: number, updates: Partial<CAEProject>): CAEProject | undefined
  // deleteProject(id: number): boolean
}
