type Role = 'user' | 'admin';

export interface User{
    id: string,
    name: string,
    role: Role
};