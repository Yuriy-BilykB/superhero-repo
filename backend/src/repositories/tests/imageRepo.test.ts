import { ImageSuperHero } from "../../db/models/ImageSuperhero";
import { imageSuperheroRepo } from "../ImageSuperheroRepo";

jest.mock("../../db/models/ImageSuperhero");

describe("ImageSuperheroRepo", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("deleteImage", () => {
        it("should delete the image if found", async () => {
            const mockDestroy = jest.fn();
            // @ts-ignore
            ImageSuperHero.findOne.mockResolvedValue({ destroy: mockDestroy });

            await imageSuperheroRepo.deleteImage(1);

            expect(ImageSuperHero.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockDestroy).toHaveBeenCalled();
        });

        it("should throw an error if image not found", async () => {
            // @ts-ignore
            ImageSuperHero.findOne.mockResolvedValue(null);

            await expect(imageSuperheroRepo.deleteImage(999)).rejects.toThrow("Image not found");
            expect(ImageSuperHero.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
        });
    });

    describe("addSuperheroImage", () => {
        it("should create a new image record", async () => {
            const mockCreateReturn = { id: 1, superheroId: 2, url: "url", public_id: "pid" };
            // @ts-ignore
            ImageSuperHero.create.mockResolvedValue(mockCreateReturn);

            const result = await imageSuperheroRepo.addSuperheroImage(2, "url", "pid");

            expect(ImageSuperHero.create).toHaveBeenCalledWith({
                superheroId: 2,
                url: "url",
                public_id: "pid",
            });
            expect(result).toEqual(mockCreateReturn);
        });
    });
});