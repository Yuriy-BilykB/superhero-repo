import {useEffect, useState} from "react";
import type {ISuperheroGet} from "../interfaces/ISuperhero";
import {deleteSuperhero, getSuperheroById} from "../services/superheroesServices";
import {Link} from "react-router-dom";

type PropsType = {
    id: string;
};

const DetailsSuperheroComponent = ({id}: PropsType) => {
    const [superhero, setSuperhero] = useState<ISuperheroGet | null>(null);

    useEffect(() => {
        const fetchSuperhero = async () => {
            const response = await getSuperheroById(id);
            setSuperhero(response);
        };
        fetchSuperhero();
    }, [id]);

    const handleClick = async (id: string) => {
        setSuperhero(null);
        await deleteSuperhero(id);
    };

    if (!superhero)
        return (
            <div
                className="flex flex-col items-center justify-center h-64 text-center p-6 bg-red-50 rounded-lg shadow-md max-w-md mx-auto mt-10">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mb-4 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
                </svg>
                <p className="text-red-700 font-semibold text-lg">Superhero not found</p>
                <p className="text-red-500 mt-2">Oops! We couldn't find the superhero you're looking for.</p>
                <Link to="/" className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
                    Go back to list
                </Link>
            </div>
        );

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-4xl font-extrabold mb-4 text-gray-900">{superhero.nickname}</h1>
            <p className="mb-2">
                <strong className="font-semibold">Real Name:</strong> {superhero.real_name}
            </p>
            <p className="mb-2">
                <strong className="font-semibold">Description:</strong> {superhero.origin_description}
            </p>
            <p className="mb-2">
                <strong className="font-semibold">Superpowers:</strong> {superhero.superpowers}
            </p>
            <p className="mb-6 italic text-lg text-gray-600">"{superhero.catch_phrase}"</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {superhero.images && superhero.images.length > 0 ? (
                    superhero.images.map(({id, url}) => (
                        <img
                            key={id}
                            src={url}
                            alt={`${superhero.nickname} image ${id}`}
                            className="w-full h-48 object-cover rounded-lg shadow-sm"
                            loading="lazy"
                        />
                    ))
                ) : (
                    <p className="text-gray-500">No images available</p>
                )}
            </div>

            <div className="flex space-x-4">
                <Link to={`/superhero/${superhero.id}/edit`}>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                        Edit
                    </button>
                </Link>
                <button
                    onClick={() => handleClick(superhero.id!)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default DetailsSuperheroComponent;
