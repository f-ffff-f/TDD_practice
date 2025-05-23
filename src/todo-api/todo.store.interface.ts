export interface Todo {
  id: number
  task: string
  completed: boolean
}

export interface ITodoStore {
  getAllTodos(): Todo[]
  addTodo(task: string): Todo
  // 향후 확장 가능한 메서드들
  // getTodoById(id: number): Todo | undefined
  // updateTodo(id: number, updates: Partial<Todo>): Todo | undefined
  // deleteTodo(id: number): boolean
}
