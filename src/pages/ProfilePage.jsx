import { Link } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function ProfilePage() {
    const { email, token } = useAuth();
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
            const completed = data.tasks.filter(todo => todo.isCompleted === true).length;
            const active = data.tasks.filter(todo => todo.isCompleted === false).length;
            const total = data.tasks.length;

            setStats({total, completed, active});
        }
        fetchStats();
    }, [token]);
    return(
        <div className="account">
            <h2>Profile Page</h2>
            <div className="accountdetails">
                <p>Email: {email}</p>
            </div>
            <div className="button">
                <Link className="linkButton" to={'/'}>
                    Go back
                </Link>
            </div>
            <div className="results">
                <p>Total Todos: {stats.total}</p>

                <p>Completed: {stats.completed}</p>

                <p>Active: {stats.active}</p>
            </div>
        </div>
    )
}

export default ProfilePage;