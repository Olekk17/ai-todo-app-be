export type SignUpRequest = {
  email: string;
  password: string;
};

export type TodoToCreate = {
  userId?: number;
  title: string;
  description?: string;
}

export type Todo = TodoToCreate & {
  id: number;
  status: 'created' | 'inProgress' | 'completed';
  createdAt: Date;
  inProgressAt?: Date;
  completedAt?: Date;
  estimatedTime?: number;
};

export type DecodedToken = {
  id: number;
  exp: number;
}
