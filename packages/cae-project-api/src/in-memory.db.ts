import type { IInMemoryDb } from './in-memory.db.interface.js'

/**
 * 새로운 인메모리 데이터베이스 인스턴스를 생성합니다.
 * 각 호출마다 독립적인 DB 인스턴스를 반환합니다.
 */
export const createInMemoryDb = (): IInMemoryDb => {
  return {
    projects: [],
    nextId: 1,
  }
}

// 프로덕션용 싱글턴 인스턴스 (필요시)
let singletonDb: IInMemoryDb | null = null

/**
 * 싱글턴 인메모리 데이터베이스 인스턴스를 반환합니다.
 * 프로덕션 환경에서 사용됩니다.
 */
export const getSingletonDb = (): IInMemoryDb => {
  if (!singletonDb) {
    singletonDb = createInMemoryDb()
  }
  return singletonDb
}
