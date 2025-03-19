import { useEffect, useState } from 'react';
import styles from './ProtectedPage.module.css'
import { useNavigate } from 'react-router-dom'
import api from '../../api.js'

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
            const response = await api.get("/api/", config);
            setUsers(response.data);
        } catch (err) {
            console.log(err);
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