import {ImageSuperHero} from "../db/models/ImageSuperhero";

class ImageSuperheroRepo {
    async deleteImage(id: number): Promise<void> {
        const image = await ImageSuperHero.findOne({ where: { id } });
        if (!image) {
            throw new Error("Image not found");
        }
        await image.destroy();
    }
    async addSuperheroImage(superheroId: number, url: string, public_id: string) {
        return await ImageSuperHero.create({
            superheroId,
            url,
            public_id
        });
    }
}

export const imageSuperheroRepo = new ImageSuperheroRepo();