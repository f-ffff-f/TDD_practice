import type { Todo } from './todo.store.interface'

export interface IInMemoryDb {
  todos: Todo[]
  nextId: number
}
