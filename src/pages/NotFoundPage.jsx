import { Link } from "react-router";

function NotFoundPage() {
    return (
        <div>
            <h2>404 - Page Not Found</h2>
            <Link className="linkButton" to={'/'}>
                Go back Home
            </Link>
            <Link className="linkButton" to={'/about'}>
                About
            </Link>
            <Link className="linkButton" to={'/login'}>
                Login
            </Link>
        </div>
    )
}

export default NotFoundPage;