import type { CAEProject } from '@/3_domain/entities/cae-project.interface'
import type { ICAEProjectRepository } from '@/3_domain/repositories/cae-project.repository.interface'
import type { IInMemoryDb } from '@/4_Persistence/persistence/in-memory/in-memory.db.interface'

// 도메인 계층에 위치하게 되면 데이터 관리 방법을 알게되기 때문에 계층구조의 독립성과 의존성 원칙을 깨뜨리게 됨.
// 도메인계층의 인터페이스를 의존하는것은 의존성 원칙을 깨는것이 아님. 세부구현에 의존하고 있고 단지 그것을 구현화 하는것이기 때문에 도메인 계층도, 퍼시스턴스 계층도 서로의 세부 구현사항에선 몰라도 되고 오로지 인터페이스를 통해 소통함.
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
