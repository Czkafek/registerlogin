import styles from './RegisterPage.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import validator from 'validator'
import axios from 'axios'

function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        error: ''
    });

    const fetchAPI = async () => {
        const response = await axios.post("http://localhost:3000/api/user/register", {name: formData.username, email: formData.email, password: formData.password});
        console.log(response.status);
        if(response.status === 200)
            navigate('/login');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.username.length < 3)
            return setFormData(data => ({ ...data, error: "Invalid username"}));
        if (formData.email.length < 3 || !validator.isEmail(formData.email))
            return setFormData(data => ({ ...data, error: "Invalid email"}));
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
            <h1>Register</h1>
            <input type="text" name='username' value={formData.username} onChange={handleChange} placeholder="Username" />
            <input type="text" name='email' value={formData.email} onChange={handleChange} placeholder="Email" />
            <input type="password" name='password' value={formData.password} onChange={handleChange} placeholder="Password" />
            {formData.error && <p className={styles.error}>{formData.error}</p>}
            <button>Register</button>
            <Link to={'/Login'} >Already have an account? Login</Link>
            </form>
    </>;
}

export default RegisterPage;