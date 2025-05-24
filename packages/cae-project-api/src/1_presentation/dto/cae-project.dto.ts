import { CAEProject } from '@/3_domain/entities/cae-project.interface'

// DTO
export interface CreateCAEProjectRequest {
  name: string
  description: string
  type: CAEProject['type']
}

export interface UpdateCAEProjectRequest {
  name?: string
  description?: string
  status?: CAEProject['status']
  meshCount?: number
  solverConfig?: CAEProject['solverConfig']
}
