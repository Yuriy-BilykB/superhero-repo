import request from "supertest";
import express, {Request, Response, NextFunction} from "express";
import ImageSuperheroController from "../../controllers/ImageSuperheroController";
import {AppError} from "../../authMiddleware/AppError";
import {ImageSuperHero} from "../../db/models/ImageSuperhero";
import {imageSuperheroRepo} from "../../repositories/ImageSuperheroRepo";
import * as cloudinaryService from "../../services/cloudinaryService";

jest.mock("../../db/models/ImageSuperhero");
jest.mock("../../repositories/ImageSuperheroRepo");
jest.mock("../../services/cloudinaryService");

const app = express();
app.use(express.json());


app.delete("/image/:id", (req, res, next) => ImageSuperheroController.deleteImageSuperhero(req, res, next));
app.post("/image/:id", (req, res, next) => ImageSuperheroController.addImagesToSuperhero(req, res, next));
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json({message: err.message, code: err.code});
});

describe("ImageSuperheroController", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("deleteImageSuperhero", () => {
        it("should return 404 if id param is missing", async () => {
            const res = await request(app).delete("/image/").send();
            expect(res.status).toBe(404);
        });

        it("should return 404 if image not found", async () => {
            (ImageSuperHero.findByPk as jest.Mock).mockResolvedValue(null);

            const res = await request(app).delete("/image/1").send();

            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Image not found");
        });

        it("should return 400 if id is invalid", async () => {
            (ImageSuperHero.findByPk as jest.Mock).mockResolvedValue({public_id: "some_id"});

            const res = await request(app).delete("/image/abc").send();

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Invalid image ID");
        });

        it("should delete image and return success message", async () => {
            (ImageSuperHero.findByPk as jest.Mock).mockResolvedValue({public_id: "public_id_test"});
            (imageSuperheroRepo.deleteImage as jest.Mock).mockResolvedValue(null);
            (cloudinaryService.deleteFromCloudinary as jest.Mock).mockResolvedValue(null);

            const res = await request(app).delete("/image/1").send();

            expect(imageSuperheroRepo.deleteImage).toHaveBeenCalledWith(1);
            expect(cloudinaryService.deleteFromCloudinary).toHaveBeenCalledWith("public_id_test");
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Image deleted successfully");
        });
    });

    describe("addImagesToSuperhero", () => {
        it("should call next with AppError if no files uploaded", async () => {
            const next = jest.fn();

            const req = {
                params: { id: "1" },
                files: [],
            } as unknown as Request;

            const res = {} as Response;

            await ImageSuperheroController.addImagesToSuperhero(req, res, next);

            expect(next).toHaveBeenCalled();
            const err = next.mock.calls[0][0];
            expect(err).toBeInstanceOf(AppError);
            expect(err.message).toBe("No files uploaded");
            expect(err.status).toBe(400);
        });

        it("should upload images and save them", async () => {
            const fakeFiles = [
                { buffer: Buffer.from("file1") },
                { buffer: Buffer.from("file2") },
            ] as unknown as Express.Multer.File[];

            const req = {
                params: { id: "1" },
                files: fakeFiles,
            } as unknown as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            (cloudinaryService.uploadToCloudinary as jest.Mock)
                .mockImplementation((buffer: Buffer) => {
                    return Promise.resolve({
                        secure_url: `https://cloudinary.com/${buffer.toString()}`,
                        public_id: `public_id_${buffer.toString()}`
                    });
                });

            (imageSuperheroRepo.addSuperheroImage as jest.Mock).mockResolvedValue(null);

            const next = jest.fn();

            await ImageSuperheroController.addImagesToSuperhero(req, res, next);

            expect(cloudinaryService.uploadToCloudinary).toHaveBeenCalledTimes(fakeFiles.length);
            expect(imageSuperheroRepo.addSuperheroImage).toHaveBeenCalledTimes(fakeFiles.length);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: "Images uploaded successfully",
                images: expect.any(Array),
            }));
            expect(next).not.toHaveBeenCalled();
        });

        it("should call next with error if upload fails", async () => {
            const fakeFiles = [
                { buffer: Buffer.from("file1") }
            ] as unknown as Express.Multer.File[];

            const req = {
                params: { id: "1" },
                files: fakeFiles,
            } as unknown as Request;

            const res = {} as Response;
            const next = jest.fn();

            (cloudinaryService.uploadToCloudinary as jest.Mock).mockRejectedValue(new Error("Upload error"));

            await ImageSuperheroController.addImagesToSuperhero(req, res, next);

            expect(next).toHaveBeenCalled();
            const err = next.mock.calls[0][0];
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toBe("Upload error");
        });
    });
});
