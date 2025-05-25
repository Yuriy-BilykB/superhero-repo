import {api} from "../utils/axios/axios";
import type {ISuperhero, ISuperheroesTotal, ISuperheroGet} from "../interfaces/ISuperhero";
function handleError(error: any, context: string): never {
    console.error(`❌ ${context}:`, error?.response?.data?.message || error?.message || error);
    throw new Error(error?.response?.data?.message || error?.message || "Unknown error");
}
export const addSuperhero = async (superheroData: ISuperhero) => {
    const formData = new FormData();
    formData.append("nickname", superheroData.nickname);
    formData.append("real_name", superheroData.real_name);
    formData.append("origin_description", superheroData.origin_description);
    formData.append("superpowers", superheroData.superpowers);
    formData.append("catch_phrase", superheroData.catch_phrase);
    if (superheroData.image) {
        formData.append("image", superheroData.image);
    }

    try {
        const response = await api.post("/superheroes", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        handleError(error, "Error adding superhero");
    }

}

export const getSuperheroes = async (page: number, limit: number): Promise<ISuperheroesTotal> => {
    try {
        const response = await api.get(`/superheroes?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        handleError(error, "Error getting superheroes");
        throw error;
    }
}

export const getSuperheroById = async (id: string): Promise<ISuperheroGet> => {
    try {
        const response = await api.get(`/superheroes/${id}`);
        return response.data;
    }catch (error) {
        handleError(error, "Error getting superhero by ID");
    }
}

export const updateSuperhero = async (id: string, data: ISuperheroGet) => {
    try {
        const { data: updated } = await api.patch(`/superheroes/${id}`, data);
        return updated;
    }catch (error) {
        handleError(error, "Error updating superhero");
    }

};

export const deleteImage = async (imageId: string) => {
    try {
        const { data } = await api.delete(`/images/${imageId}`);
        return data;
    }catch (error) {
        handleError(error, "Error deleting image");
    }

};

export const addImageSuperhero = async (id: string, formData: FormData) => {
    try {
        const response = await api.patch(`/superheroes/images/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }catch (error) {
        handleError(error, "Error adding image to superhero");
    }
};

export const deleteSuperhero = async (id: string) => {
    try {
        const { data } = await api.delete(`/superheroes/${id}`);
        return data;
    }catch (error) {
        handleError(error, "Error deleting superhero");
    }
};