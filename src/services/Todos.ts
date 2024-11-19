import { Todo } from "../models/Todo";
import { Todo as TodoType} from "../types";

const getTodosByUserId = (userId: number) => {
  return Todo.findAll({ where: { userId } });
};

const deleteTodoById = (id: number) => {
  return Todo.destroy({ where: { id } });
};

const patchTodoById = (id: number, todo: Partial<Todo>) => {
  return Todo.update(todo, { where: { id } });
};

const addTodo = (todo: TodoType) => {
  return Todo.create(todo);
};

const getTodoById = (id: number) => {
  return Todo.findOne({ where: { id } });
}

const updateTodoById = (id: number, todo: Partial<Todo>) => {
  return Todo.update(todo, { where: { id } });
}

export const TodoServices = {
  getTodosByUserId,
  deleteTodoById,
  patchTodoById,
  addTodo,
  getTodoById,
  updateTodoById,
};
