import {RequestCreateUser} from "../model/RequestCreateUser.ts";
import {DefaultUserRepository, UserRepository} from "../repository/UserRepository.ts";
import {ResponseUser} from "../model/ResponseUser.ts";
import {ResponseMessage} from "../model/ResponseMessage.ts";

export interface UserService {
    createUser(reqBody: RequestCreateUser): Promise<void>
    findUsersByGroup(groupName: string): Promise<ResponseUser[]>
    deleteUserByUserName(userName: string): Promise<ResponseMessage>
}

export class DefaultUserService implements UserService {
    constructor(private userRepository: UserRepository = new DefaultUserRepository()) {}
    async createUser(reqBody: RequestCreateUser): Promise<void> {
       await this.userRepository.createUser(reqBody)
    }

    async findUsersByGroup(groupName: string): Promise<ResponseUser[]> {
        return await this.userRepository.findUsersByGroup(groupName)
    }

    async deleteUserByUserName(userName: string): Promise<ResponseMessage> {
        return await this.userRepository.deleteUserByUserName(userName)
    }

}