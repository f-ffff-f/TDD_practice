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
// 또한 DIP에 의거하여 안쪽 계층과 바깥쪽 계층이 추상화된 인터페이스를 통해 의존하게 한다.
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
