import { Link } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function ProfilePage() {
    const { name, token, isAuthenticated } = useAuth();
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        active: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchStats() {
            if (!token) return;

            try {
                setLoading(true);
                setError('');

                const options = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': token
                    },
                    credentials: 'include'
                };

                const res = await fetch('/api/tasks', options);

                if (res.status === 401) {
                    throw new Error("Unauthorized");
                }

                if (!res.ok) {
                    throw new Error("Failed to fetch todos");
                }

                const data = await res.json();

                const todos = Array.isArray(data) 
                ? data 
                : Array.isArray(data.tasks)
                    ? data.tasks
                    : [];

                const total = todos.length;
                const completed = todos.filter((todo) => todo.isCompleted).length;
                const active = total - completed;

                setStats({ total, completed, active });
            } catch (error) {
                setError(`Error loading statistics: ${error.message}`);
            } finally {
                setLoading(false);
            }

        }
        fetchStats();
    }, [token]);
    return (
        <div className="account">
            <div className="button">
                <Link className="linkButton" to={'/'}>
                    Go back
                </Link>
            </div>
            <h2>Profile Page</h2>

            <div className="accountdetails">
                <p>Name: {name}</p>
            </div>

            <p>Status: {isAuthenticated ? 'Authenticated' : 'Not authenticated'}</p>

            {loading ? (
                <p>Loading statistics...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div className="results">

                    <p>Total Todos: {stats.total}</p>

                    <p>Completed: {stats.completed}</p>

                    <p>Active: {stats.active}</p>

                    {stats.total > 0 ? (
                        <p>Completion: {Math.round((stats.completed / stats.total) * 100)}%</p>
                    ) : (
                        <p>No todos yet. Completion percentage will appear after you add a todo.</p>
                    )}

                </div>
            )}
        </div>
    )
};

export default ProfilePage;