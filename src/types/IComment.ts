import type IUser from "./IUser";

export default interface IComment {
    id?: number;
    content: string;
    createdAt: string;
    userId: number;
    user?: IUser;
}
