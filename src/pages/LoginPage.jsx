import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
    const {login, isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [isLoggingOn, setIsLoggingOn] = useState(false);
    
    const from = location.state?.from?.pathname || '/todos';

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, {replace: true})
        }
    }, [isAuthenticated, navigate, from])

    async function handleSubmit(e) {
        e.preventDefault();
        setAuthError('');
        setIsLoggingOn(true);

        try {
            const result = await login(email, password);
            if (result.success) {
                navigate(from, {replace: true});
            }else {
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

            {authError && <p>{authError}</p>}

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

            <button type="submit" 
            disabled={isLoggingOn}>
                {isLoggingOn === true 
                ? "Logging in..." 
                : "Log In" }
                </button>
        </form>
    )
}

export default LoginPage;