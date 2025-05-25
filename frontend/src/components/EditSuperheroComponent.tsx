import {useEffect, useState} from "react";
import type {ISuperheroGet} from "../interfaces/ISuperhero";
import {getSuperheroById, updateSuperhero, deleteImage, addImageSuperhero} from "../services/superheroesServices";
import toast from "react-hot-toast";

type Props = {
    id: string;
};

const EditSuperheroForm = ({id}: Props) => {
    const [superhero, setSuperhero] = useState<ISuperheroGet | null>(null);
    const [nickname, setNickname] = useState("");
    const [realName, setRealName] = useState("");
    const [description, setDescription] = useState("");
    const [superpowers, setSuperpowers] = useState("");
    const [catchPhrase, setCatchPhrase] = useState("");
    const [newImages, setNewImages] = useState<File[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getSuperheroById(id);
            if (data) {
                setSuperhero(data);
                setNickname(data.nickname);
                setRealName(data.real_name);
                setDescription(data.origin_description);
                setSuperpowers(data.superpowers);
                setCatchPhrase(data.catch_phrase);
            }


        };
        fetchData();
    }, [id]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await updateSuperhero(id, {
                nickname,
                real_name: realName,
                origin_description: description,
                superpowers,
                catch_phrase: catchPhrase,
            });

            if (newImages.length > 0) {
                const formData = new FormData();
                newImages.forEach((file) => formData.append("images", file));
                await addImageSuperhero(id, formData);
                setNewImages([]);
            }

            const data = await getSuperheroById(id);
            setSuperhero(data!);
            toast.success("Successfully updated");
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteImage = async (imageId: string) => {
        await deleteImage(imageId);
        setSuperhero((prev) =>
            prev
                ? {
                    ...prev,
                    images: Array.isArray(prev.images)
                        ? prev.images.filter((img) => img.id !== imageId)
                        : [],
                }
                : null
        );
    };

    if (!superhero) return <p>Loading...</p>;

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-6">
            <h2 className="text-3xl font-extrabold text-gray-800">🦸 Edit Superhero</h2>

            <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Nickname"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                required
            />
            <input
                value={realName}
                onChange={(e) => setRealName(e.target.value)}
                placeholder="Real Name"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                required
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Origin Description"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                required
            />
            <textarea
                value={superpowers}
                onChange={(e) => setSuperpowers(e.target.value)}
                placeholder="Superpowers"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                required
            />
            <input
                value={catchPhrase}
                onChange={(e) => setCatchPhrase(e.target.value)}
                placeholder="Catch Phrase"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                required
            />
            <div>
                <label className="block mb-2 text-lg font-medium text-gray-700">Upload new images</label>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files) {
                            setNewImages(Array.from(e.target.files));
                        }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                 file:rounded-xl file:border-0 file:text-sm file:font-semibold
                 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
                />
            </div>

            <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 rounded-xl shadow transition disabled:opacity-50"
            >
                {isSaving ? "Saving..." : "💾 Save Changes"}
            </button>

            <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">🖼️ Existing Images</h3>
                {superhero.images && superhero.images.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {superhero.images.map(({id, url}) => (
                            <div key={id} className="relative group overflow-hidden rounded-xl shadow-md">
                                <img
                                    src={url}
                                    alt="superhero"
                                    className="w-full h-40 object-cover transform group-hover:scale-105 transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleDeleteImage(id)}
                                    className="absolute top-2 right-2 bg-red-600 text-white text-sm px-3 py-1 rounded-full shadow hover:bg-red-700 transition opacity-0 group-hover:opacity-100"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No images available</p>
                )}
            </div>
        </form>

    );
};

export default EditSuperheroForm;
