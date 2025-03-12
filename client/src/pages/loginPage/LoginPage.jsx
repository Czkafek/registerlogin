import styles from './LoginPage.module.css'

function LoginPage() {
    return <>
        <form action="">
            <h1>Login</h1>
            <input type="text" placeholder="Username or Email" />
            <input type="text" placeholder="Password" />
            <button>Login</button>
        </form>
    </>;
}

export default LoginPage;