import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

function Logoff() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isLoggingOff, setIsLoggingOff] = useState(false);
    const [authError, setAuthError] = useState('');

    async function handleLogoff() {
        setIsLoggingOff(true);
        setAuthError('');

        const result = await logout();

        if (result.success) {
            navigate('/login');
        } else {
            setAuthError(result.error);
            setIsLoggingOff(false);
        }
    }
    return (
        <>
            {authError && <p>{authError}</p>}
            <button onClick={handleLogoff} disabled={isLoggingOff}>
                {isLoggingOff === true ? "Logging off..." : "Log Off"}
            </button>
        </>
    )
}

export default Logoff;