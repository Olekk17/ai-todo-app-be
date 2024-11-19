import { SignUpRequest } from "../types";
import { User } from "../models/User";

const insertUser = (user: SignUpRequest) => {
  return User.create(user);
};

const checkIfEmailUsed = async(email: string) => {
  return !!(await User.findOne({ where: { email } }));
}

const getUser = (id: number) => {
  return User.findOne({ where: { id } });
}

const getUserByEmail = (email: string) => {
  return User.findOne({ where: { email } });
}

export const UserServices = {
  insertUser,
  checkIfEmailUsed,
  getUser,
  getUserByEmail,
};
