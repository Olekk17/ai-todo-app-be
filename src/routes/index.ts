import { Router } from "express";
import { analyzeLastNTasks, getUser, SignIn, SignUp } from "../controllers/User";
import { addTodo, deleteTodo, getTipForTodo, getTodos, patchTodo } from "../controllers/Todos";
import { auth } from "../middleware/auth";

export const router = Router();

router.route("/signup").post(SignUp);
router.route("/signin").post(SignIn);

// Auth routes only:
router.use(auth);
router.route("/get-user-info/:id").get(getUser);
router.route("/todos").get(getTodos).post(addTodo);
router.route("/todos/:id").delete(deleteTodo).patch(patchTodo);
router.route("/todos/tip/:id").get(getTipForTodo);
router.route("/user/anylyzeTodos").get(analyzeLastNTasks)
