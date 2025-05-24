import type { CAEProject } from '@/3_domain/entities/cae-project.interface'
import type { ICAEProjectRepository } from '@/3_domain/repositories/cae-project.repository.interface'
import type { IInMemoryDb } from '@/4_Persistence/persistence/in-memory/in-memory.db.interface'

export class InMemoryCAEProjectRepository implements ICAEProjectRepository {
  #db: IInMemoryDb

  constructor(database: IInMemoryDb) {
    this.#db = database
  }

  getAllProjects(): CAEProject[] {
    return [...this.#db.projects] // 내부 배열의 복사본 반환
  }

  addProject({
    name,
    description,
    type,
  }: {
    name: string
    description: string
    type: CAEProject['type']
  }): CAEProject {
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
