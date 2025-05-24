import type { Todo } from './todo.store.interface.js'

export interface IInMemoryDb {
  todos: Todo[]
  nextId: number
}
