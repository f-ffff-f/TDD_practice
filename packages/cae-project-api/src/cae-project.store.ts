import type { CAEProject } from '@/cae-project.types.js'
import type { ICAEProjectStore } from '@/cae-project.store.interface.js'
import type { IInMemoryDb } from '@/in-memory.db.interface.js'

export class InMemoryCAEProjectStore implements ICAEProjectStore {
  #db: IInMemoryDb

  constructor(database: IInMemoryDb) {
    this.#db = database
  }

  getAllProjects(): CAEProject[] {
    return [...this.#db.projects] // 내부 배열의 복사본 반환
  }

  addProject(
    name: string,
    description: string,
    type: CAEProject['type']
  ): CAEProject {
    const now = new Date()
    const newProject: CAEProject = {
      id: this.#db.nextId++,
      name,
      description,
      type,
      status: 'created',
      createdAt: now,
      updatedAt: now,
    }
    this.#db.projects.push(newProject)
    return { ...newProject } // 생성된 객체의 복사본 반환
  }
}

// Re-export types for convenience
export type { ICAEProjectStore } from '@/cae-project.store.interface.js'
