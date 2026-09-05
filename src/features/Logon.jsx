import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function Logon() {
    const {login} = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [isLoggingOn, setIsLoggingOn] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setAuthError('');
        setIsLoggingOn(true);

        try {
            const result = await login(email, password);
            if (result.success) {
                //AuthContext already handled the successful login
            } else {
                setAuthError(result.error);
            }
        } catch (error) {
            setAuthError(`Error: ${error.name} | ${error.message}`);
        } finally {
            setIsLoggingOn(false);
        }
    }
    return(
        <form onSubmit={handleSubmit}>

            {authError && authError}

            <label htmlFor="email">
                Email
                <input
                type="email"
                id="email"
                name="email"
                value = {email}
                onChange = {(e) => {setEmail(e.target.value)} }
                required
                />
            </label>

            <label htmlFor="password">
                Password
                <input
                    type="password"
                    id="password"
                    name="password"
                    value = {password}
                    onChange = {(e) => {setPassword(e.target.value)}}
                    required
                />
            </label>

            <button type="submit" disabled={isLoggingOn}>{isLoggingOn === true ? "Logging in..." : "Log On" }</button>
        </form>
    )
}

export default Logon;