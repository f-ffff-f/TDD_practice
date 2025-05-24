import type { CAEProject } from '@/cae-project.types'

export interface IInMemoryDb {
  projects: CAEProject[]
  nextId: number
}
