import { useEffect, useState } from 'react';
import styles from './ProtectedPage.module.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function ProtectedPage() {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);

    const fetchAPI = async () => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jsonwebtoken')}`
                }
            };
            const response = await axios.get("http://localhost:3000/api/", config);
            setUsers(response.data);
        } catch (err) {
            navigate('/login');
        }
    };

    useEffect(() => {
        fetchAPI();
    }, [])

    return <div className={styles.ProtectedPageContainer}>
        <h1>Protected Page</h1>
        <div className={styles.userGrid}>
            <div className={styles.userHeader}><p>Name</p><p>Email</p><p>Password</p></div>
            <div className={styles.line}></div>
            {users.map((user, index) => {
                return <div key={index} className={styles.user}><p>{user.name}</p><p>{user.email}</p><p>{user.password}</p></div>
            })}
        </div>
    </div>
}

export default ProtectedPage;