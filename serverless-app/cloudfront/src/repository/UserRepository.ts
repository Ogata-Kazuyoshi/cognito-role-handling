import {RequestCreateUser} from "../model/RequestCreateUser.ts";
import {Http, HttpClient} from "../network/http.ts";
import {ResponseUser} from "../model/ResponseUser.ts";
import {ResponseMessage} from "../model/ResponseMessage.ts";

export interface UserRepository {
    createUser(reqBody: RequestCreateUser): Promise<void>
    findUsersByGroup(groupName: string): Promise<ResponseUser[]>
    deleteUserByUserName(userName: string): Promise<ResponseMessage>
}

export class DefaultUserRepository implements UserRepository {
    apiGateway: string = import.meta.env.VITE_APIGATEWAY
    constructor(private http: Http = new HttpClient()) {}
    async createUser(reqBody: RequestCreateUser): Promise<void> {
        await this.http.post(`${this.apiGateway}/api/users`, reqBody)
    }

    async findUsersByGroup(groupName: string): Promise<ResponseUser[]> {
        return await this.http.get(`${this.apiGateway}/api/users/${groupName}`)
    }

    async deleteUserByUserName(userName: string): Promise<ResponseMessage> {
        return await this.http.delete(`${this.apiGateway}/api/users?userName=${userName}`)
    }

}