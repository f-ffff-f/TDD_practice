import type { CAEProject } from '@/domain/entities/cae-project.types'
import type { ICAEProjectRepository } from '@/infrastructure/repositories/cae-project.repository.interface'
import type { IInMemoryDb } from '@/infrastructure/persistence/in-memory/in-memory.db.interface'
import { CreateProjectCommand } from '@/application/dto/project.commands'

export class InMemoryCAEProjectRepository implements ICAEProjectRepository {
  #db: IInMemoryDb

  constructor(database: IInMemoryDb) {
    this.#db = database
  }

  getAllProjects(): CAEProject[] {
    return [...this.#db.projects] // 내부 배열의 복사본 반환
  }

  addProject(command: CreateProjectCommand): CAEProject {
    const now = new Date()
    const newProject: CAEProject = {
      id: this.#db.nextId++,
      name: command.name,
      description: command.description,
      type: command.type,
      status: 'created',
      createdAt: now,
      updatedAt: now,
    }
    this.#db.projects.push(newProject)
    return { ...newProject } // 생성된 객체의 복사본 반환
  }
}
