import { User } from "../models/user"
import dynamoDb from "../config/dynamoDb";

export interface IUserService {
    addUser(user: User): Promise<void>;
    getUsers() : Promise<User[]>;
    //getUserById(userId: string): Promise<User>
    //deleteUser(userId: string): Promise<void>
    //updateUser(user: Partial<User>): Promise<void>
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
}
