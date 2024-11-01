import './App.css';
import axios from "axios";
import {useState} from "react";

interface Email {
    email: string
}
function App() {
    const [email, setEmail] = useState('')
    const handleClick = async () => {
        const res =
            await axios.get('/api/users', )
                .then(res => res.data)
        console.log({res})
    }

    const handleResister = async () => {
        const reqBody: Email = {
            email: email
        }
        await axios.post('/api/users', reqBody )
    }

  return (
    <>
        <div>Cognitoのトライ</div>
        <div>
            <button onClick={handleClick}>User情報取得</button>
        </div>
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
    </>
  );
}

export default App;
