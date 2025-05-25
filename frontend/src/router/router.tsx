import {createBrowserRouter} from "react-router-dom";
import SuperheroesPage from "../pages/SuperheroesPage.tsx";
import AddSuperheroPage from "../pages/AddSuperheroPage.tsx";
import DetailsSuperheroPage from "../pages/DetailsSuperheroPage.tsx";
import EditSuperheroPage from "../pages/EditSuperheroPage.tsx";
import MainLayout from "../pages/MainLayout.tsx";

export const router = createBrowserRouter([
    {
        element: <MainLayout/>,
        children: [
            { path: "/", element: <SuperheroesPage /> },
            {path: '/superhero/new', element: <AddSuperheroPage/>},
            {path: '/superhero/:id', element: <DetailsSuperheroPage/>},
            {path: '/superhero/:id/edit', element: <EditSuperheroPage/>}
        ]
    }
])