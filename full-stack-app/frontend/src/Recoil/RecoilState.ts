import {atom} from "recoil";
import {UserProfile} from "../model/UserProfile.ts";
import {UserProfileFixture} from "../fixture/UserProfileFixture.ts";

export const isAuthorizedState = atom<boolean>({
    key: 'isAuthenticatedState',
    default: false,
})

export const userProfileSate = atom<UserProfile>({
    key: 'userProfileSate',
    default: UserProfileFixture.build(),
})