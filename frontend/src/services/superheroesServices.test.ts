import {api} from "../utils/axios/axios";
import {
    addSuperhero,
    getSuperheroes,
    getSuperheroById, deleteSuperhero, addImageSuperhero, deleteImage, updateSuperhero,
} from "./superheroesServices";

jest.mock("../utils/axios/axios");

const mockedApi = api as jest.Mocked<typeof api>;

describe("superheroesServices", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("addSuperhero", () => {
        const mockSuperhero = {
            nickname: "Testman",
            real_name: "Test Real",
            origin_description: "Test origin",
            superpowers: "Testing",
            catch_phrase: "Just test it",
            image: new File(["(⌐□_□)"], "test.png", {type: "image/png"}),
        };

        it("should send POST request with correct FormData and return data", async () => {
            const mockResponse = {data: {id: 1, ...mockSuperhero}};
            mockedApi.post.mockResolvedValueOnce(mockResponse);

            const result = await addSuperhero(mockSuperhero);

            expect(result).toEqual(mockResponse.data);
            expect(mockedApi.post).toHaveBeenCalled();
        });

        it("should throw error if request fails", async () => {
            const mockError = new Error("Network error");
            mockedApi.post.mockRejectedValueOnce(mockError);

            await expect(addSuperhero(mockSuperhero)).rejects.toThrow("Network error");
        });
    });

    describe("getSuperheroes", () => {
        it("should return data on successful request", async () => {
            const mockData = {
                superheroes: [{id: 1, nickname: "Test Hero"}],
                total: 1,
            };
            mockedApi.get.mockResolvedValueOnce({data: mockData});

            const result = await getSuperheroes(0, 5);

            expect(mockedApi.get).toHaveBeenCalledWith("/superheroes?page=0&limit=5");
            expect(result).toEqual(mockData);
        });

        it("should throw error when request fails", async () => {
            const mockError = new Error("Network Error");
            mockedApi.get.mockRejectedValueOnce(mockError);

            await expect(getSuperheroes(0, 5)).rejects.toThrow("Network Error");
        });
    });

    describe("getSuperheroById", () => {
        it("should return data on success", async () => {
            const mockData = { id: "1", nickname: "Hero" };
            mockedApi.get.mockResolvedValueOnce({ data: mockData });

            const result = await getSuperheroById("1");

            expect(mockedApi.get).toHaveBeenCalledWith("/superheroes/1");
            expect(result).toEqual(mockData);
        });

        it("should throw error on failure", async () => {
            const error = new Error("Network error");
            mockedApi.get.mockRejectedValueOnce(error);

            await expect(getSuperheroById("1")).rejects.toThrow("Network error");
            expect(mockedApi.get).toHaveBeenCalledWith("/superheroes/1");
        });
    });

    describe("updateSuperhero", () => {
        const id = '1';
        const data = {
            id,
            nickname: "Updated Hero",
            real_name: "Real Name",
            origin_description: "Desc",
            superpowers: "Superpowers",
            catch_phrase: "Phrase",
            image: null,
        };

        it("should PATCH and return updated data", async () => {
            const mockResponse = { data };
            mockedApi.patch.mockResolvedValueOnce(mockResponse);

            const result = await updateSuperhero(id, data);

            expect(mockedApi.patch).toHaveBeenCalledWith(`/superheroes/${id}`, data);
            expect(result).toEqual(data);
        });

        it("should throw error on failure", async () => {
            const error = new Error("Update failed");
            mockedApi.patch.mockRejectedValueOnce(error);

            await expect(updateSuperhero(id, data)).rejects.toThrow("Update failed");
            expect(mockedApi.patch).toHaveBeenCalledWith(`/superheroes/${id}`, data);
        });
    });


    describe("deleteImage", () => {
        const imageId = "img123";

        it("should DELETE and return data", async () => {
            const mockData = {success: true};
            mockedApi.delete.mockResolvedValueOnce({data: mockData});

            const result = await deleteImage(imageId);

            expect(mockedApi.delete).toHaveBeenCalledWith(`/images/${imageId}`);
            expect(result).toEqual(mockData);
        });

        it("should throw error on failure", async () => {
            const error = new Error("Delete image failed");
            mockedApi.delete.mockRejectedValueOnce(error);

            await expect(deleteImage(imageId)).rejects.toThrow("Delete image failed");
            expect(mockedApi.delete).toHaveBeenCalledWith(`/images/${imageId}`);
        });
    });


    describe("addImageSuperhero", () => {
        const id = "123";
        const formData = new FormData();
        formData.append("file", new Blob(["data"]), "image.png");

        it("should PATCH with formData and return data", async () => {
            const mockData = {imageUrl: "someurl"};
            mockedApi.patch.mockResolvedValueOnce({data: mockData});

            const result = await addImageSuperhero(id, formData);

            expect(mockedApi.patch).toHaveBeenCalledWith(
                `/superheroes/images/${id}`,
                formData,
                {
                    headers: {"Content-Type": "multipart/form-data"},
                }
            );
            expect(result).toEqual(mockData);
        });

        it("should throw error on failure", async () => {
            const error = new Error("Add image failed");
            mockedApi.patch.mockRejectedValueOnce(error);

            await expect(addImageSuperhero(id, formData)).rejects.toThrow("Add image failed");
            expect(mockedApi.patch).toHaveBeenCalledWith(
                `/superheroes/images/${id}`,
                formData,
                {
                    headers: {"Content-Type": "multipart/form-data"},
                }
            );
        });
    });

    describe("deleteSuperhero", () => {
        const id = "1";

        it("should DELETE and return data", async () => {
            const mockData = {success: true};
            mockedApi.delete.mockResolvedValueOnce({data: mockData});

            const result = await deleteSuperhero(id);

            expect(mockedApi.delete).toHaveBeenCalledWith(`/superheroes/${id}`);
            expect(result).toEqual(mockData);
        });

        it("should throw error on failure", async () => {
            const error = new Error("Delete failed");
            mockedApi.delete.mockRejectedValueOnce(error);

            await expect(deleteSuperhero(id)).rejects.toThrow("Delete failed");
            expect(mockedApi.delete).toHaveBeenCalledWith(`/superheroes/${id}`);
        });
    });


});
