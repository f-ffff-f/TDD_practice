//--------------------------------
/**
 * @deprecated
 */
import { CAEProject } from '@/domain/entities/cae-project.types'

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
