import { Request, Response } from "express";
import { TodoServices } from "../services/Todos";
import { Todo } from "../types";
import OpenAI from "openai";
import { baseAiContext } from "../сonstants";

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
      await TodoServices.updateTodoById(+id, req.body as Partial<Todo>);
      const patchedTodo = await TodoServices.getTodoById(+id);
      return res.send(patchedTodo);
    }

    res.status(403).send("Forbidden");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const getTipForTodo = async (req: Request & any, res: Response) => {
  const id = req.params.id as number;
  const todo = await TodoServices.getTodoById(+id);
  if (!todo) {
    return res.status(404).json({ message: "Todo was not found" });
  }
  let timeTakenInHours: number | undefined;
  if (
    todo.status === "completed" &&
    todo.estimatedTime &&
    todo.inProgressAt &&
    todo.completedAt
  ) {
    timeTakenInHours =
      (new Date(todo.completedAt).getTime() -
        new Date(todo.inProgressAt).getTime()) /
      1000 /
      60 /
      60;
  }
  try {
    const openai = new OpenAI();

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: baseAiContext,
        },
        {
          role: "user",
          content: JSON.stringify({ ...todo, timeTakenInHours }),
        },
      ],
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "text" },
    });
    if (completion.choices[0].message.content) {
      return res.status(200).json(completion.choices[0].message.content);
    }

    return res
      .status(500)
      .json({ message: "Something went wrong getting response" });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || "Internal Server Error",
    });
  }
};
