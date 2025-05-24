import { CreateProjectCommand } from '@/application/dto/project.commands'
import type { CAEProject } from '@/domain/entities/cae-project.types'

export interface ICAEProjectRepository {
  getAllProjects(): CAEProject[]
  addProject(command: CreateProjectCommand): CAEProject
  // 향후 확장 가능한 메서드들
  // getProjectById(id: number): CAEProject | undefined
  // updateProject(id: number, updates: Partial<CAEProject>): CAEProject | undefined
  // deleteProject(id: number): boolean
}
