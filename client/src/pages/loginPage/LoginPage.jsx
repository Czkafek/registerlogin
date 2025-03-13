import styles from './LoginPage.module.css'
import { Link } from 'react-router-dom'

function LoginPage() {
    return <>
        <form action="">
            <h1>Login</h1>
            <input type="text" placeholder="Username or Email" />
            <input type="text" placeholder="Password" />
            <button>Login</button>
            <Link to={'/Register'}>Doesn't have account yet? Register</Link>
        </form>
    </>;
}

export default LoginPage;