import { Request, Response } from "express";
import { userService } from "../services/userService";



export class UserController {
    private userServiceInstance = new userService();

    async createUser(req: Request, res: Response) {
        try {
            const user = req.body;
            await this.userServiceInstance.addUser(user);
            res.status(201).json({message: 'User created'});
        } catch (error) {
            res.status(500).json({error: `Fialed to create user. ${error}`});
        }
    }

    async getUsers(req: Request, res: Response) {
        try {
            const result = await this.userServiceInstance.getUsers();
            res.status(200).json({user: result});
        } catch (error) {
            res.status(500).json({error: 'Failed to get users'});
        }
    }
}

