import {ImageSuperHero} from "../db/models/ImageSuperhero";
import {Superhero} from "../db/models/Superhero";
import {AppError} from "../authMiddleware/AppError";
import {deleteFromCloudinary} from "../services/cloudinaryService";

class SuperheroRepo {
    async createSuperhero(data: Partial<Superhero>) {
        return await Superhero.create(data);
    }
    async getSuperheroes(page: number = 0, limit: number = 5){
        const offset = page * limit;
        const [data, total] = await Promise.all([
            Superhero.findAll({
                include: [
                    {
                        model: ImageSuperHero,
                        as: 'images',
                        attributes: ['id', 'url'],
                    }
                ],
                limit,
                offset,
            }),
            Superhero.count(),
        ]);
        return { data, total };
    }

    async getSuperheroById(id: number) {
        return await Superhero.findByPk(id, {
            include: [
                {
                    model: ImageSuperHero,
                    as: 'images',
                    attributes: ['id', 'url'],
                },
            ],
        });
    }
    async deleteSuperhero(id: number) {
        const superhero = await Superhero.findByPk(id, {
            include: [
                {
                    model: ImageSuperHero,
                    as: 'images',
                },
            ],
        });
        if (!superhero) {
            throw new AppError("Superhero not found", 404);
        }
        if (superhero.images && superhero.images.length > 0) {
            await Promise.all(
                superhero.images.map(async (img) => {
                    try {
                        await deleteFromCloudinary(img.public_id);
                    } catch (error) {
                        console.error(`Failed to delete image ${img.public_id} from Cloudinary`, error);
                    }
                })
            );
        }
        await superhero.destroy();
    }
}

export const superheroRepo = new SuperheroRepo();