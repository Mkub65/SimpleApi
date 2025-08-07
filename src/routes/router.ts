import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router();
const userController = new UserController();


router.post('/users', (req, res) => userController.createUser(req, res));
router.get('/getUsers', (req, res) => userController.getUsers(req, res))

export default router;