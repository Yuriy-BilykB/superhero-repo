import type {ISuperheroGet} from "../interfaces/ISuperhero.ts";
import {Link} from "react-router-dom";
import {deleteSuperhero} from "../services/superheroesServices.ts";

interface Props {
    superhero: ISuperheroGet;
    onDelete: (id: string) => void;
}

const SuperheroComponent = ({superhero, onDelete}: Props) => {
    const handleClick = async (id: string) => {
        onDelete(id)
        await deleteSuperhero(id);
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all">
            <h2 className="text-2xl font-bold text-blue-700 mb-2">{superhero.nickname}</h2>

            <div className="mt-4">
                {superhero.images && superhero.images.length > 0 ? (
                    (() => {
                        const {url, id} = superhero.images[0];
                        return (
                            <img
                                key={id}
                                src={url}
                                alt={`${superhero.nickname} image`}
                                className="w-full h-64 object-cover rounded-lg shadow-sm"
                                loading="lazy"
                            />
                        );
                    })()
                ) : (
                    <p className="text-red-400 mt-2">No images available</p>
                )}
            </div>

            <div className="flex justify-between mt-6">
                <button onClick={() => handleClick(superhero.id!)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow">
                    Delete
                </button>
                <Link to={`/superhero/${superhero.id}`}>
                    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow">
                        Details
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default SuperheroComponent;
