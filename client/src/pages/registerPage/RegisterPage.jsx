import styles from './RegisterPage.module.css'

function RegisterPage() {
    return <>
        <form action="">
            <h1>Register</h1>
            <input type="text" placeholder="Username" />
            <input type="text" placeholder="Email" />
            <input type="text" placeholder="Password" />
            <button>Register</button>
        </form>
    </>;
}

export default RegisterPage;