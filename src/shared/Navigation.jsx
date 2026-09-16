import { NavLink } from "react-router";
import { useAuth } from "../contexts/AuthContext";

const navLinkStyle = ({ isActive }) =>
    isActive ? 'nav-link active' : 'nav-link';

function Navigation() {
    const { isAuthenticated } = useAuth();
    return (
        <nav aria-label="Main navigation">
            <ul className="nav-list">
                <li>
                    <NavLink to='/about' className={navLinkStyle}> About </NavLink>
                </li>

                {isAuthenticated ? (
                    <>
                        <li>
                            <NavLink to='/todos' className={navLinkStyle}>Todos</NavLink>
                        </li>
                        <li>
                            <NavLink to='/profile' className={navLinkStyle}>Profile</NavLink>
                        </li>
                    </>
                ) : (
                    <li>
                        <NavLink
                            to='/login' 
                            className={navLinkStyle}
                            >
                                Login
                        </NavLink>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Navigation;
