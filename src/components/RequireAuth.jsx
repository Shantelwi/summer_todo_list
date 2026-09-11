import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

function RequireAuth({ children }) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', {
                replace: true,
                state: {from:location}
            });
        }
    }, [isAuthenticated, navigate, location]);

    if (!isAuthenticated) {
        return <p>Redirecting...</p>;
    }

    return children;
}

export default RequireAuth;