import { useAuth } from "../contexts/AuthContext";

function Header() {
    const { isAuthenticated } = useAuth();
    return(
        <header>
            <h1>
                {isAuthenticated ? 'Todo List' : "Welcome"}
            </h1>

        </header>
    )
}

export default Header;