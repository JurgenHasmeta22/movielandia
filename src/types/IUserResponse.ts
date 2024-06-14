import IUser from "./IUser";

export default interface IUserResponse {
    count: number;
    rows: IUser[];
}
