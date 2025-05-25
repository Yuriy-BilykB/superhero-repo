import { Link, Outlet } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <nav className="p-4 bg-gray-200 shadow">
                <ul className="flex gap-6">
                    <li>
                        <Link to="/" className="text-blue-600 font-semibold hover:underline">
                            Superheroes
                        </Link>
                    </li>
                    <li>
                        <Link to="/superhero/new" className="text-blue-600 font-semibold hover:underline">
                            Add Superhero
                        </Link>
                    </li>
                </ul>
            </nav>
            <main className="p-4 flex-1">
                <Toaster position="top-right" reverseOrder={false} />
                <Outlet/>
            </main>
        </div>
    );
};

export default MainLayout;
