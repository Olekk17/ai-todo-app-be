import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { SignUpRequest } from "../types";
import { UserServices } from "../services/User";
import jwt from "jsonwebtoken";
import { TodoServices } from "../services/Todos";
import OpenAI from "openai";
import { baseAiContext } from "../сonstants";

export const SignUp = async (
  req: Request<any, any, SignUpRequest>,
  res: Response
) => {
  try {
    const { email, password } = req.body;
    if (await UserServices.checkIfEmailUsed(email)) {
      return res.status(400).send("Email is already used");
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await UserServices.insertUser({ email, password: hashedPassword });
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const getUser = async (
  req: Request<any, any, { id: number }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const user = await UserServices.getUser(+id);
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const SignIn = async (
  req: Request<any, any, { email: string; password: string }>,
  res: Response
) => {
  try {
    const { email, password } = req.body;
    const user = await UserServices.getUserByEmail(email);
    if (!user) {
      return res.status(400).send("User not found");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).send("Incorrect Password");
    }

    const jwtToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );


    res.send(jwtToken);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const analyzeLastNTasks = async (req: Request & any, res: Response) => {
  const id = req.userId as number;
  const n = req.query.n as string | undefined;
  if (!n) {
    return res.status(400).send("n is required");
  }
  const tasks = await TodoServices.getLastNTasks(+n, +id);
  const tasksWithTimeSpent = tasks.map((task) => {
    const copy = JSON.parse(JSON.stringify(task));
    let timeSpent: number | undefined; // in hours

    if (task.inProgressAt && task.completedAt) {
      timeSpent =
        (new Date(task.completedAt).getTime() -
          new Date(task.inProgressAt).getTime()) /
        1000 /
        60 /
        60;
    }

    if (timeSpent) {
      copy.timeSpentInHours = timeSpent;
    }

    return copy;
  });

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
          content: JSON.stringify(tasksWithTimeSpent),
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
