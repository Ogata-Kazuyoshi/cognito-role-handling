import {useState} from "react";
import axios from "axios";
import {Email} from "../model/RequestCreateUser.ts";
import {useNavigate} from "react-router-dom";
import {useSetRecoilState} from "recoil";
import {isAuthorizedState, userProfileSate} from "../Recoil/RecoilState.ts";
import {UserProfileFixture} from "../fixture/UserProfileFixture.ts";

export const Application = () => {
    const [email, setEmail] = useState('')
    const navigate = useNavigate()
    const setIsAuthenticated = useSetRecoilState(isAuthorizedState)
    const setUserProfile = useSetRecoilState(userProfileSate)

    const handleResister = async () => {
        const reqBody: Email = {
            email: email
        }
        await axios.post('/api/users', reqBody )
    }

    const handleLogout = async () => {
        await axios.get('/logout')
        setIsAuthenticated(false)
        setUserProfile(UserProfileFixture.build)
        navigate('/')
    }

    return <>
        <div>Cognitoのトライ</div>
        <br/>
        <div>
            <label>新規登録ユーザー</label>
            <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br/>
            <button onClick={handleResister}>新規登録</button>
        </div>
        <div>
            <button onClick={handleLogout}>ログアウト</button>
        </div>
    </>
}