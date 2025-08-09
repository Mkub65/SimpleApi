import { Request, Response } from "express";
import { z } from 'zod';
import { userService } from "../services/userService";
import { userSchema } from "../schemas/userSchema";



export class UserController {
    private userServiceInstance = new userService();

    async createUser(req: Request, res: Response) {
        try {
            const parsedUser = userSchema.parse(req.body);
            await this.userServiceInstance.addUser(parsedUser);
            res.status(201).json({message: 'User created'});
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({errors: error.issues});
            }
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

    async getUserById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const user = await this.userServiceInstance.getUserById(id);
            
            if(!user) {
                return res.status(404).json({message: 'User not found!'});
            }

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({message: `${error}`});
        }
    }

    async deleteUserById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            await this.userServiceInstance.deleteUser(id);
            res.status(200).json({message: 'User deleted'});
        } catch (error) {
            res.status(500).json({message: `Failed to delete User. ${error}`});
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            await this.userServiceInstance.updateUser(req.body);
            res.status(204).json({message: 'User updated'});
        } catch (error) {
            res.status(500).json({message: 'Failed to update user'});
        }
    }
}

