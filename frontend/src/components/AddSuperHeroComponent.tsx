import {useState} from "react";
import type {ISuperhero} from "../interfaces/ISuperhero.ts";
import * as React from "react";
import {addSuperhero} from "../services/superheroesServices.ts";
import toast from 'react-hot-toast';

const AddSuperHeroComponent = () => {
    const [superhero, setSuperhero] = useState<ISuperhero>({
        nickname: '',
        real_name: '',
        origin_description: '',
        superpowers: '',
        catch_phrase: '',
        image: null
    });
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, files} = e.target;
        if (name === 'image' && files) {
            setSuperhero({...superhero, image: files[0]});
        } else {
            setSuperhero({...superhero, [name]: value});
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addSuperhero(superhero);
            toast.success("Superhero successfully added!")
            setSuperhero({
                nickname: '',
                real_name: '',
                origin_description: '',
                superpowers: '',
                catch_phrase: '',
                image: null
            });
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

        } catch (error) {
            console.error("Failed to add superhero:", error);
            toast.error("Failed to add superhero.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
            <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">Add Superhero</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {[
                    {label: 'Nickname', name: 'nickname'},
                    {label: 'Real name', name: 'real_name'},
                    {label: 'Origin description', name: 'origin_description'},
                    {label: 'Super powers', name: 'superpowers'},
                    {label: 'Catch phrase', name: 'catch_phrase'}
                ].map(({label, name}) => (
                    <div key={name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                        <input
                            type="text"
                            name={name}
                            value={superhero[name as keyof ISuperhero] as string}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                ))}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    <input
                        type="file"
                        name="image"
                        onChange={handleChange}
                        ref={fileInputRef}
                        className="w-full file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddSuperHeroComponent;
