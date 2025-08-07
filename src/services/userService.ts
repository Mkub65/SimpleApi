import { User } from "../models/user"
import dynamoDb from "../config/dynamoDb";
import { error } from "console";

export interface IUserService {
    addUser(user: User): Promise<void>;
    getUsers() : Promise<User[]>;
    getUserById(userId: string): Promise<User>
    deleteUser(userId: string): Promise<void>
    updateUser(user: Partial<User>): Promise<void>
}

export class userService implements IUserService {
    async addUser(user: User): Promise<void> {
        try {
            const params = {
                TableName: process.env.DYNAMO_TABLE_NAME!,
                Item: user
            };

            dynamoDb.put(params).promise();
        } catch(error) {
            console.log(error);
        };

    }

    async getUsers(): Promise<User[]> {
        const params = {
            TableName: process.env.DYNAMO_TABLE_NAME!
        }
        const result = await dynamoDb.scan(params).promise();
        return result.Items as User[];
    }

    async getUserById(userId: string): Promise<User> {
        const params = {
            TableName: process.env.DYNAMO_TABLE_NAME!,
            Key: { userId }
        };
        const result = await dynamoDb.get(params).promise();
        return result.Item as User || null;
    }

    async deleteUser(userId: string): Promise<void> {
        const params = {
            TableName: process.env.DYNAMO_TABLE_NAME!,
            Key: { userId }
        };
        const result = await dynamoDb.delete(params).promise();
    }

    async updateUser(user: Partial<User>): Promise<void> {
        if (!user.id) { 
            throw error("ID is Required")
        }
        const userId = user.id;
        const params = {
            TableName: process.env.DYNAMO_TABLE_NAME!,
            Key: {userId},
            UpdateExpression: "SET #name = :name, #role = :role",
            ExpressionAttributeNames: {
            "#name": "name",
            "#role": "role"
            },
        ExpressionAttributeValues: {
            ":name": user.name,
            ":role": user.role
            }
        };
        await dynamoDb.update(params).promise();
    }
}
