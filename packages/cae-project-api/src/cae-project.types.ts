//-------------------------------
// 도메인 엔티티

export interface CAEProject {
  id: number
  name: string
  description: string
  type: 'structural' | 'fluid' | 'thermal' | 'coupled'
  status:
    | 'created'
    | 'preprocessing'
    | 'solving'
    | 'postprocessing'
    | 'completed'
    | 'failed'
  meshCount?: number
  solverConfig?: {
    timeStep?: number
    iterations?: number
    convergenceCriteria?: number
  }
  createdAt: Date
  updatedAt: Date
}

//--------------------------------
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
