import { useEffect, useState } from 'react';
import styles from './ProtectedPage.module.css'
import { useNavigate } from 'react-router-dom'
import api from '../../api.js'

function ProtectedPage() {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLodaing] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const hasInitialFetch = sessionStorage.getItem('initialFetchDone');

        const fetchAPI = async () => {
            if (hasInitialFetch === 'true') return;

            try {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jsonwebtoken')}`
                    }
                };
                const response = await api.get("/api/", config);
                setUsers(response.data);
                setLodaing(false);
                sessionStorage.setItem('initialFetchDone', 'true');
            } catch (err) {
                console.log(err);
                setError('Failed to fetch data');
                setLodaing(false);
                navigate('/login');
            }
        };

        fetchAPI();
        
        return () => {
            sessionStorage.removeItem('initialFetchDone');
        };
 
    }, [navigate])

    if (loading) return <div><h1>Lodaing...</h1></div>
    if (error) return <div><h1>Error: {error}</h1></div>

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