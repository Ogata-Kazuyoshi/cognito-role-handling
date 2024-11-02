import {Outlet, useNavigate} from "react-router-dom";
import {useRecoilState, useSetRecoilState} from "recoil";
import {isAuthorizedState, userProfileSate} from "../Recoil/RecoilState.ts";
import {useEffect} from "react";
import axios from "axios";
import {UserProfile} from "../model/UserProfile.ts";
import {UserProfileFixture} from "../fixture/UserProfileFixture.ts";

export const AuthProvider = () => {
    const [isAuthenticated, setIsAuthenticated] = useRecoilState(isAuthorizedState)
    const setUserProfile = useSetRecoilState(userProfileSate)
    const navigate = useNavigate()

    useEffect(() => {
        axios.get<UserProfile>('/api/users')
            .then(res => res.data)
            .then(res => {
                setIsAuthenticated(true)
                setUserProfile(res)
                navigate('/app')
            })
            .catch(error => {
                console.log({error})
                setIsAuthenticated(false)
                setUserProfile(UserProfileFixture.build)
                navigate('/login')
            })
    }, [isAuthenticated]);

    return <>
    <Outlet />
    </>
}