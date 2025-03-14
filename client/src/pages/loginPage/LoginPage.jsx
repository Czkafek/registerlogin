import styles from './LoginPage.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import axios from 'axios'

function LoginPage() {
    
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        login: '',
        password: '',
        error: ''
    });

    const fetchAPI = async () => {
        try {
            const response = await axios.post("http://localhost:3000/api/user/login", {login: formData.login, password: formData.password});
            console.log(response);
            const token = response.data.accessToken;
            localStorage.setItem('jsonwebtoken', token);
            navigate('/');
        } catch (err) {
            if(err.status === 400) {
                setFormData(data => ({...data, error: err.response.data.error[0].msg}))
            }
            else {
                setFormData(data => ({...data, error: err.response.data.error}))
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.login.length < 3)
            return setFormData(data => ({ ...data, error: "Invalid username or email"}));
        if (formData.password.length < 8 ||
            !/[A-Z]/.test(formData.password) ||  // wielka litera
            !/[a-z]/.test(formData.password) ||  // mała litera
            !/[0-9]/.test(formData.password))  //  cyfra
            return setFormData(data => ({ ...data, error: "Invalid password"}));
        setFormData(data => ({ ...data, error: ""}));
        fetchAPI();
    }

    const handleChange = (e) => {
        setFormData(data  => ({
            ...data,
            [e.target.name]: e.target.value
        }));
    }
    
    return <>
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <input type="text" name='login' value={formData.login} onChange={handleChange} placeholder="Username or Email" />
            <input type="password" name='password' value={formData.password} onChange={handleChange} placeholder="Password" />
            {formData.error && <p className={styles.error}>{formData.error}</p>}
            <button>Login</button>
            <Link to={'/Register'}>Need a new account? Register</Link>
        </form>
    </>;
}

export default LoginPage;