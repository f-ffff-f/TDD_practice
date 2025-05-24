import type { CAEProject } from '@/cae-project.types.js'

export interface ICAEProjectStore {
  getAllProjects(): CAEProject[]
  addProject(
    name: string,
    description: string,
    type: CAEProject['type']
  ): CAEProject
  // 향후 확장 가능한 메서드들
  // getProjectById(id: number): CAEProject | undefined
  // updateProject(id: number, updates: Partial<CAEProject>): CAEProject | undefined
  // deleteProject(id: number): boolean
}
