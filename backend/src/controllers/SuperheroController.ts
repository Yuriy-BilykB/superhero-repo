import {Request, Response, NextFunction} from "express";
import {uploadToCloudinary} from "../services/cloudinaryService";
import {superheroRepo} from "../repositories/SuperheroRepo";
import {CloudinaryUploadResult} from "../types/CloudinaryUploadResult";
import {AppError} from "../authMiddleware/AppError";
import {Superhero} from "../db/models/Superhero";
import {imageSuperheroRepo} from "../repositories/ImageSuperheroRepo";

class SuperheroController {
    async addSuperhero(req: Request, res: Response, next: NextFunction) {
        try {
            const {nickname, real_name, origin_description, superpowers, catch_phrase} = req.body;
            const file = req.file;
            if (!nickname || !real_name || !origin_description || !superpowers || !catch_phrase) {
                throw new AppError("All superhero fields are required", 400, "VALIDATION_ERROR");
            }
            if (!file) {
                throw new AppError("Image file is required", 400, "FILE_MISSING");
            }

            const newSuperhero = await superheroRepo.createSuperhero({
                nickname,
                real_name,
                origin_description,
                superpowers,
                catch_phrase,
            });

            const result = await uploadToCloudinary(file.buffer) as CloudinaryUploadResult;

            if (!result || !result.secure_url) {
                throw new AppError("Failed to upload image", 502, "UPLOAD_FAILED");
            }

            await imageSuperheroRepo.addSuperheroImage(newSuperhero.id, result.secure_url, result.public_id);

            res.status(201).json({message: "Superhero created", superhero: newSuperhero});
        } catch (error) {
            next(error);
        }
    }

    async getAllSuperheroes(req: Request, res: Response, next: NextFunction) {
        try {
            const page = Number(req.query.page) || 0;
            const limit = Number(req.query.limit) || 5;
            const {data, total} = await superheroRepo.getSuperheroes(page, limit);
            if (!data || data.length === 0) {
                throw new AppError("Superheroes not found", 404);
            }
            res.status(200).json({
                superheroes: data,
                total,
            });
        } catch (error) {
            next(error)
        }
    }

    async getSuperheroById(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;

            if (!id) {
                throw new AppError("Id not found", 400);
            }
            const superhero = await superheroRepo.getSuperheroById(Number(id));

            if (!superhero) {
                throw new AppError("Superhero not found", 404);
            }
            res.status(200).json(superhero);
        } catch (error) {
            next(error);
        }
    }
    async updateSuperhero(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const updates = req.body;
            if (!id || !updates) {
                throw new AppError("Id or data not provided", 400);
            }
            const superhero = await superheroRepo.getSuperheroById(Number(id));

            if (!superhero) {
                throw new AppError("Superhero not found", 404);
            }
            await Superhero.update(updates, { where: { id } });
            const updated = await superheroRepo.getSuperheroById(Number(id));
            res.status(200).json(updated);
        } catch (error) {
            next(error);
        }
    }
    async removeSuperhero (req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                throw new AppError("Id not found", 400);
            }

            const superhero = await superheroRepo.getSuperheroById(id);
            if (!superhero) {
                throw new AppError("Superhero not found", 404);
            }

            await superheroRepo.deleteSuperhero(id);
            res.status(200).json({ message: "Superhero deleted" });
        } catch (error) {
            next(error);
        }
    }
}

export default new SuperheroController();