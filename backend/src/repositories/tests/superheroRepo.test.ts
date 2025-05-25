import { Superhero } from "../../db/models/Superhero";
import { ImageSuperHero } from "../../db/models/ImageSuperhero";
import { superheroRepo } from "../SuperheroRepo";
import { deleteFromCloudinary } from "../../services/cloudinaryService";
import { AppError } from "../../authMiddleware/AppError";

jest.mock("../../db/models/Superhero");
jest.mock("../../db/models/ImageSuperhero");
jest.mock("../../services/cloudinaryService");

describe("SuperheroRepo", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createSuperhero", () => {
        it("should create a superhero", async () => {
            const data = { nickname: "Hero" };
            // @ts-ignore
            Superhero.create.mockResolvedValue(data);

            const result = await superheroRepo.createSuperhero(data);

            expect(Superhero.create).toHaveBeenCalledWith(data);
            expect(result).toEqual(data);
        });
    });

    describe("getSuperheroes", () => {
        it("should return paginated superheroes with images and total count", async () => {
            const mockSuperheroes = [{ id: 1, name: "Hero", images: [] }];
            const mockCount = 10;

            // @ts-ignore
            Superhero.findAll.mockResolvedValue(mockSuperheroes);
            // @ts-ignore
            Superhero.count.mockResolvedValue(mockCount);

            const result = await superheroRepo.getSuperheroes(1, 5);

            expect(Superhero.findAll).toHaveBeenCalledWith({
                include: [
                    {
                        model: ImageSuperHero,
                        as: "images",
                        attributes: ["id", "url"],
                    },
                ],
                limit: 5,
                offset: 5,
            });
            expect(Superhero.count).toHaveBeenCalled();
            expect(result).toEqual({ data: mockSuperheroes, total: mockCount });
        });
    });

    describe("getSuperheroById", () => {
        it("should return superhero by id with images", async () => {
            const mockSuperhero = { id: 1, name: "Hero", images: [] };
            // @ts-ignore
            Superhero.findByPk.mockResolvedValue(mockSuperhero);

            const result = await superheroRepo.getSuperheroById(1);

            expect(Superhero.findByPk).toHaveBeenCalledWith(1, {
                include: [
                    {
                        model: ImageSuperHero,
                        as: "images",
                        attributes: ["id", "url"],
                    },
                ],
            });
            expect(result).toEqual(mockSuperhero);
        });
    });

    describe("deleteSuperhero", () => {
        it("should delete superhero and its images from cloudinary", async () => {
            const mockImages = [
                { public_id: "cloud_id_1" },
                { public_id: "cloud_id_2" },
            ];
            const mockSuperhero = {
                images: mockImages,
                destroy: jest.fn().mockResolvedValue(undefined),
            };
            // @ts-ignore
            Superhero.findByPk.mockResolvedValue(mockSuperhero);
            (deleteFromCloudinary as jest.Mock).mockResolvedValue(undefined);

            await superheroRepo.deleteSuperhero(1);

            expect(Superhero.findByPk).toHaveBeenCalledWith(1, {
                include: [
                    {
                        model: ImageSuperHero,
                        as: "images",
                    },
                ],
            });

            expect(deleteFromCloudinary).toHaveBeenCalledTimes(mockImages.length);
            expect(deleteFromCloudinary).toHaveBeenCalledWith("cloud_id_1");
            expect(deleteFromCloudinary).toHaveBeenCalledWith("cloud_id_2");

            expect(mockSuperhero.destroy).toHaveBeenCalled();
        });

        it("should throw AppError if superhero not found", async () => {
            // @ts-ignore
            Superhero.findByPk.mockResolvedValue(null);

            await expect(superheroRepo.deleteSuperhero(999)).rejects.toThrow(AppError);
            await expect(superheroRepo.deleteSuperhero(999)).rejects.toMatchObject({
                message: "Superhero not found",
                status: 404,
            });
        });

        it("should log error and continue if deleting image from Cloudinary fails", async () => {
            const mockImages = [{ public_id: "cloud_fail_id" }];
            const mockSuperhero = {
                images: mockImages,
                destroy: jest.fn().mockResolvedValue(undefined),
            };
            // @ts-ignore
            Superhero.findByPk.mockResolvedValue(mockSuperhero);

            const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
            (deleteFromCloudinary as jest.Mock).mockRejectedValue(new Error("Cloudinary error"));

            await superheroRepo.deleteSuperhero(1);

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                expect.stringContaining("Failed to delete image cloud_fail_id from Cloudinary"),
                expect.any(Error)
            );
            expect(mockSuperhero.destroy).toHaveBeenCalled();

            consoleErrorSpy.mockRestore();
        });
    });
});
