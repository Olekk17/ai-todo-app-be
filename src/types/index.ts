export type SignUpRequest = {
  email: string;
  password: string;
};

export type TodoToCreate = {
  userId?: number;
  title: string;
  completed: boolean;
}

export type Todo = TodoToCreate & {
  id: number
};

export type DecodedToken = {
  id: number;
  exp: number;
}
