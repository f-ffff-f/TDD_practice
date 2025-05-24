import type { Todo, ITodoStore } from './todo.store.interface.js'
import type { IInMemoryDb } from './in-memory.db.interface.js'

export class InMemoryTodoStore implements ITodoStore {
  #db: IInMemoryDb

  constructor(database: IInMemoryDb) {
    this.#db = database
  }

  getAllTodos(): Todo[] {
    return [...this.#db.todos] // 내부 배열의 복사본 반환
  }

  addTodo(task: string): Todo {
    const newTodo: Todo = {
      id: this.#db.nextId++,
      task,
      completed: false,
    }
    this.#db.todos.push(newTodo)
    return { ...newTodo } // 생성된 객체의 복사본 반환
  }
}

// Re-export types for convenience
export type { ITodoStore, Todo } from './todo.store.interface.js'
