import { Link } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function ProfilePage() {
    const { email, logout, token } = useAuth();
    const [stats, setStats] = useState({
        total: 0, 
        completed: 0, 
        active: 0
    });

    useEffect(() => {
        async function fetchStats() {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token
                },
                credentials: 'include'
            };

            const res = await fetch('/api/tasks', options);
            const data = await res.json();
            
        }
        fetchStats();
    }, [token]);
    return(
        <div className="account">
            <h2>Profile Page</h2>
            <div className="accountdetails">
                <p>Email: {email}</p>
            </div>

            <div className="buttons">
                <Link className="linkButton" to={'/'}>
                    Go back
                </Link>
                <button onClick={logout}> Log off</button>
            </div>
        </div>
    )
}

export default ProfilePage;