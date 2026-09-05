import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function Logoff() {
    const {logout} = useAuth();
    const [isLoggingOff, setIsLoggingOff] = useState(false);
    const [authError, setAuthError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setAuthError('');
        setIsLoggingOff(true);
        try {
            const result = await logout();
            if (!result.success) {
                setAuthError(result.error);
            }
        } catch (error) {
            setAuthError(`Error: ${error.name} | ${error.message}`);
        } finally {
            setIsLoggingOff(false);
        }
    }
    return(
        <form onSubmit={handleSubmit}>

            {authError && authError}
            <button type="submit" disabled={isLoggingOff}>{isLoggingOff === true ? "Logging off..." : "Log Off" }</button>
        </form>
    )
}

export default Logoff;