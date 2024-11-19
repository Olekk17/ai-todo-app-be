import { Request, Response } from "express";
import { TodoServices } from "../services/Todos";
import { Todo } from "../types";

export const getTodos = async (req: Request & any, res: Response) => {
  try {
    const id = req.userId as number;
    const todos = await TodoServices.getTodosByUserId(+id);
    res.send(todos);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const addTodo = async (req: Request & any, res: Response) => {
  try {
    const todo = req.body as Todo;
    const id = req.userId as number;
    const response = await TodoServices.addTodo({ ...todo, userId: id });
    res.send(response.dataValues);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const deleteTodo = async (req: Request & any, res: Response) => {
  try {
    const id = req.params.id;
    const userId = req.userId as number;
    const todo = await TodoServices.getTodoById(+id);
    if (todo?.userId === userId) {
      await TodoServices.deleteTodoById(+id);
      return res.send("Deleted Successfully");
    }

    res.status(403).send("Forbidden");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const patchTodo = async (req: Request & any, res: Response) => {
  try {
    const id = req.params.id;
    const userId = req.userId as number;
    const todo = await TodoServices.getTodoById(+id);
    if (todo?.userId === userId) {
      await TodoServices.updateTodoById(
        +id,
        req.body as Partial<Todo>
      );
      const patchedTodo = await TodoServices.getTodoById(+id);
      return res.send(patchedTodo);
    }

    res.status(403).send("Forbidden");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
