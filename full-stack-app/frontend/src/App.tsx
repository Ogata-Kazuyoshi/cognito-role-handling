import './App.css';
import axios from "axios";

function App() {
    const handleClick = async () => {
        const res =
            await axios.get('/api/users', )
                .then(res => res.data)
        console.log({res})
    }

  return (
    <>
        <div>Cognitoのトライ</div>
        <div>
            <button onClick={handleClick}>User情報取得</button>
        </div>
    </>
  );
}

export default App;
