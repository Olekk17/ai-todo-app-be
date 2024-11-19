import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { SignUpRequest } from "../types";
import { UserServices } from "../services/User";
import jwt from "jsonwebtoken";

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

    console.log(jwtToken);

    res.send(jwtToken);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
