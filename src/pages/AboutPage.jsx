import { Link } from "react-router";

function AboutPage() {
    return (
        <>
            <header>
                <h1>About Page</h1>
            </header>

            <section className="infoBox1">
                <p>
                    A modern Todo web
                    application built with React and Vite,
                    featuring authentication, protected routes,
                    CRUD operations, optimistic UI updates, and
                    a polished responsive interface.
                </p>
            </section>

            <section className="infoBox2">
                <div className="app_features">
                    <h3>App Features</h3>
                    <ul>
                        <li>
                            🔐 User Authentication (Login / Logout)
                        </li>
                        <li>
                            📝 Create, edit, and complete todos
                        </li>
                        <li>
                            🔎 Search, filter, and sort tasks
                        </li>
                        <li>
                            📊 Profile dashboard with task statistics
                        </li>
                        <li>
                            🌙 Dark / Light mode toggle
                        </li>
                        <li>
                            🧭 Protected routes with React Router
                        </li>
                        <li>
                            ⚡ Optimistic UI updates for fast interactions
                        </li>
                        <li>
                            📱 Responsive design for mobile and desktop
                        </li>
                    </ul>
                </div>
            </section>

            <section className="infoBox3">
                <div className="technologies">
                    <ul>
                        <li>
                            💾React
                        </li>
                        <li>
                            🧭React Router
                        </li>
                        <li>
                            📟Vite
                        </li>
                    </ul>
                </div>
            </section>

            <Link className="linkButton" to={'/'}>
                Go back
            </Link>
        </>
    )
}

export default AboutPage;