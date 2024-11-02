export const Login = () => {

    const handleClick = () => {
        window.location.href = "http://localhost:8082/oauth2/authorization/cognito"
    }

    return <>
    <button onClick={handleClick}>Cognitoログインボタン</button>
    </>
}