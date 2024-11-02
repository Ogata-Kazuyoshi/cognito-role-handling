import {UserProfile} from "../model/UserProfile.ts";

export class UserProfileFixture {
    static build(overrides: Partial<UserProfile> = {}): UserProfile {
        return {
            sub: '',
            companyUUID: '',
            domain: '',
            role: '',
            ...overrides,
        }
    }
}
