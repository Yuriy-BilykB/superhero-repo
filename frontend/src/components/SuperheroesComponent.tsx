import { useEffect, useState } from "react";
import type { ISuperheroGet } from "../interfaces/ISuperhero.ts";
import { getSuperheroes } from "../services/superheroesServices.ts";
import SuperheroComponent from "./SuperheroComponent.tsx";

const SuperheroesComponent = () => {
    const [superheroes, setSuperHeroes] = useState<ISuperheroGet[]>([]);
    const [page, setPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const limit: number = 5;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const handleDelete = (id: string) => {
        setSuperHeroes(prev => prev.filter(hero => hero.id !== id));
        setTotal(prev => prev - 1);
    };


    useEffect(() => {
        const fetchSuperHeroes = async () => {
            setLoading(true);
            setError(null);
            try {
                const { superheroes, total } = await getSuperheroes(page, limit);
                setTotal(total);
                if (page === 0) {
                    setSuperHeroes(superheroes);
                } else {
                    setSuperHeroes(prev => [...prev, ...superheroes]);
                }
            } catch (error: any) {
                setError(error.message || "Error loading superheroes:");
            } finally {
                setLoading(false);
            }
        };
        fetchSuperHeroes();
    }, [page]);
    const handleClick = () => {
      setPage((prevState) => prevState + 1);
    }
    const noMoreData = (page + 1) * limit >= total;
    if (loading && superheroes.length === 0) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-500 text-xl font-semibold">
                Loading...
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex justify-center items-center h-64 text-red-500 text-xl font-semibold">
                {error}
            </div>
        );
    }

    if (superheroes.length === 0 && !loading) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-500 text-xl font-semibold">
                Superheroes not found 😞
            </div>
        );
    }
    return (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {superheroes.map((superhero) => (
                <SuperheroComponent
                    key={superhero.id}
                    superhero={superhero}
                    onDelete={handleDelete}
                />
            ))}
            {!noMoreData && (
                <button
                    onClick={handleClick}
                    disabled={loading}
                    className="col-span-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Loading..." : "Load more"}
                </button>
            )}
        </div>
    );
};

export default SuperheroesComponent;
