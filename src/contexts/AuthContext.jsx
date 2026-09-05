import { createContext, useContext, useState } from "react";

//create the context
const AuthContext = createContext();

//custom hook with error checking
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }) {
    //state for authentication
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');

    //Functions will go here
    const login = async (userEmail, password) => {
        try {
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail, password }),
                credentials: 'include'
            };

            const res = await fetch('/api/users/logon', options);
            const data = await res.json();

            if (res.status === 200 && data.name && data.csrfToken) {
                //success: update state
                setEmail(data.name);
                setToken(data.csrfToken);
                return { success: true }
            } else {
                //failure: return error
                return {
                    success: false,
                    error: `Authentication failed: ${data?.message}`
                };
            }
        } catch (error) {
            return {
                success: false,
                error: 'Network error during login'
            };
        }
    };

    const logout = async () => {
        if (!token) {
            setEmail('');
            setToken('');

            return {
                success: true
            }
        }
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token
                },
                credentials: 'include'
            };
            const res = await fetch('/api/user/logoff', options);
            if (!res.ok) {
                throw new Error("Something went wrong");
            }
            return {
                success: true
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        } finally {
            setEmail('');
            setToken('');
        }
    }

    //context value object
    const value = {
        email, //Current user's email
        token,//CSRF token for API requests
        isAuthenticated: !!token,//Computed boolean for auth status
        login,//function to authenticate user
        logout//function to clear authentication
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}