import {useState} from 'react'
import './App.css'
import {DefaultUserService, UserService} from "./service/UserService.ts";
import {RequestCreateUser} from "./model/RequestCreateUser.ts";

interface Props {
    userService?: UserService
}
export const App = (
    {
        userService = new DefaultUserService()
    }: Props
) => {

    const [email, setEmail] = useState('')
    const [allowDomain, setAllowDomain] = useState('')
    const [userName, setUserName] = useState('')

    const handleClick = async () => {
        const reqBody: RequestCreateUser = {
            email,
            allowDomain
        }
        await userService.createUser(reqBody)
    }

    const handleFindUser = async () => {
        const managerRes = await userService.findUsersByGroup('MANAGER')
        const employeeRes = await userService?.findUsersByGroup('EMPLOYEE')
        console.log({managerRes})
        console.log({employeeRes})
    }

    const handleDeleteUser = async () => {
        const res = await userService?.deleteUserByUserName(userName)
        console.log({res})
    }

  return (
      <>
          <div>ユーザーEメール入力用</div>
          <div>
              <label>user email : </label>
              <input value={email} onChange={(e) => {
                  setEmail(e.target.value)
              }} type="text"/>
          </div>
          <div>
              <label>allowDomain : </label>
              <input value={allowDomain} onChange={(e) => {
                  setAllowDomain(e.target.value)
              }} type="text"/>
          </div>
          <div>
              <button onClick={handleClick}>ユーザー登録</button>
          </div>
          <div>
              <button onClick={handleFindUser}>ユーザー情報を取得</button>
          </div>
          <div>
              <label>削除したいUserName : </label>
              <input value={userName} onChange={(e) => {
                  setUserName(e.target.value)
              }} type="text"/>
          </div>
          <div>
              <button onClick={handleDeleteUser}>ユーザーを削除</button>
          </div>
      </>
  )
}
