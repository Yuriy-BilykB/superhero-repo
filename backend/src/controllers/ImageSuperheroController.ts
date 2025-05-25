import {NextFunction, Request, Response} from "express";
import {AppError} from "../authMiddleware/AppError";
import {imageSuperheroRepo} from "../repositories/ImageSuperheroRepo";
import {ImageSuperHero} from "../db/models/ImageSuperhero";
import {deleteFromCloudinary, uploadToCloudinary} from "../services/cloudinaryService";

class ImageSuperheroController {
    async deleteImageSuperhero(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            if (!id) {
                return next(new AppError("Image id not found", 404));
            }
            const imageId = parseInt(id);
            if (isNaN(imageId)) {
                return next(new AppError("Invalid image ID", 400));
            }

            const image = await ImageSuperHero.findByPk(imageId);
            if (!image) {
                return next(new AppError("Image not found", 404));
            }

            await imageSuperheroRepo.deleteImage(imageId);
            await deleteFromCloudinary(image.public_id);

            res.status(200).json({message: "Image deleted successfully"});
        } catch (error) {
            next(error);
        }
    }

    async addImagesToSuperhero(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            const files = req.files as Express.Multer.File[];

            if (!files || files.length === 0) {
                return next(new AppError("No files uploaded", 400));
            }

            const uploadedImages = await Promise.all(
                files.map(async file => {
                    const {secure_url, public_id} = await uploadToCloudinary(file.buffer);
                    return {url: secure_url, public_id};
                })
            );

            for (const img of uploadedImages) {
                await imageSuperheroRepo.addSuperheroImage(Number(id), img.url, img.public_id);
            }

            res.status(200).json({message: "Images uploaded successfully", images: uploadedImages});
        } catch (error) {
            next(error);
        }
    }
}

export default new ImageSuperheroController();