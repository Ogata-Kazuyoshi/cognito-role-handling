import './App.css';
import {Route, Routes} from "react-router-dom";
import {AuthProvider} from "./component/AuthProvider.tsx";
import {Login} from "./component/Login.tsx";
import {Application} from "./component/Application.tsx";
import {UnAuthorized} from "./component/UnAuthorized.tsx";
import {Authorized} from "./component/Authorized.tsx";

function App() {

  return (
    <>
        <Routes>
            <Route path="/" element={<AuthProvider />}>
                <Route path="login" element={
                    <UnAuthorized>
                        <Login />
                    </UnAuthorized>
                }/>
                <Route path="app" element={
                    <Authorized>
                        <Application />
                    </Authorized>
                }/>
            </Route>
        </Routes>
    </>
  );
}

export default App;
