import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router();
const userController = new UserController();


router.post('/users', (req, res) => userController.createUser(req, res));
router.get('/getUsers', (req, res) => userController.getUsers(req, res));
router.get('/getUserById/:id', (req, res) => userController.getUserById(req, res));
router.delete('/deleteUser/:id', (req, res) => userController.deleteUserById(req, res));
router.put('/updateUser', (req, res) => userController.updateUser(req,res));

export default router;