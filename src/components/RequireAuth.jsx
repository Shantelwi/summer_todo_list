import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

function RequireAuth({children}) {
    const {isAuthenticated, isAuthChecking} = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthChecking && !isAuthenticated) {
            navigate('/login', {
                state: {from:location},
                replace: true
            });
        }
    }, [isAuthChecking, isAuthenticated, navigate, location]);
    if (isAuthChecking) {
        return <p>Loading...</p>;
    }

    if (!isAuthenticated) {
        return null;
    }

    return children;
}

export default RequireAuth;