import styles from './RegisterPage.module.css'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import validator from 'validator'

function RegisterPage() {

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        error: ''
    });

    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData.username);
        console.log(formData.email);
        console.log(formData.password);
        if (formData.username.length < 3)
            return setFormData(data => ({ ...data, error: "Invalid username"}));
        if (formData.email.length < 3 || !validator.isEmail(formData.email))
            return setFormData(data => ({ ...data, error: "Invalid email"}));
        if (formData.password.length < 8 ||
            !/[A-Z]/.test(formData.password) ||  // wielka litera
            !/[a-z]/.test(formData.password) ||  // mała litera
            !/[0-9]/.test(formData.password))  //  cyfra
            return setFormData(data => ({ ...data, error: "Invalid password"}));
        return setFormData(data => ({ ...data, error: ""}));
    }

    const handleChange = (e) => {
        setFormData(data  => ({
            ...data,
            [e.target.name]: e.target.value
        }));
    }

    return <>
        <form onSubmit={handleSubmit}>
            <h1>Register</h1>
            <input type="text" name='username' value={username} onChange={handleChange} placeholder="Username" />
            <input type="text" name='email' value={email} onChange={handleChange} placeholder="Email" />
            <input type="password" name='password' value={password} onChange={handleChange} placeholder="Password" />
            {formData.error && <p className={styles.error}>{formData.error}</p>}
            <button>Register</button>
            <Link to={'/Login'} >Already have an account? Login</Link>
            </form>
    </>;
}

export default RegisterPage;