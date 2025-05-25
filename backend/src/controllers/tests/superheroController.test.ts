import SuperheroController from '../SuperheroController';
import { superheroRepo } from '../../repositories/SuperheroRepo';
import { imageSuperheroRepo } from '../../repositories/ImageSuperheroRepo';
import { uploadToCloudinary } from '../../services/cloudinaryService';
import {Superhero} from "../../db/models/Superhero";

jest.mock('../../repositories/SuperheroRepo');
jest.mock('../../repositories/ImageSuperheroRepo');
jest.mock('../../services/cloudinaryService');

describe('SuperheroController', () => {
    let req: any;
    let res: any;
    let next: jest.Mock;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('addSuperhero', () => {
        it('should add superhero successfully', async () => {
            req.body = {
                nickname: 'Hero',
                real_name: 'John Doe',
                origin_description: 'Some origin',
                superpowers: 'Flying',
                catch_phrase: 'Here I am!',
            };
            req.file = { buffer: Buffer.from('image-data') };

            const createdSuperhero = { id: 1, ...req.body };
            (superheroRepo.createSuperhero as jest.Mock).mockResolvedValue(createdSuperhero);
            (uploadToCloudinary as jest.Mock).mockResolvedValue({ secure_url: 'url', public_id: 'id' });
            (imageSuperheroRepo.addSuperheroImage as jest.Mock).mockResolvedValue(null);

            await SuperheroController.addSuperhero(req, res, next);

            expect(superheroRepo.createSuperhero).toHaveBeenCalledWith(req.body);
            expect(uploadToCloudinary).toHaveBeenCalledWith(req.file.buffer);
            expect(imageSuperheroRepo.addSuperheroImage).toHaveBeenCalledWith(createdSuperhero.id, 'url', 'id');
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'Superhero created', superhero: createdSuperhero });
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error if required fields missing', async () => {
            req.body = {};
            req.file = null;

            await SuperheroController.addSuperhero(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('getAllSuperheroes', () => {
        it('should return superheroes list', async () => {
            const data = [{ id: 1, nickname: 'Hero' }];
            const total = 1;
            req.query = { page: '0', limit: '5' };
            (superheroRepo.getSuperheroes as jest.Mock).mockResolvedValue({ data, total });

            await SuperheroController.getAllSuperheroes(req, res, next);

            expect(superheroRepo.getSuperheroes).toHaveBeenCalledWith(0, 5);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ superheroes: data, total });
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error if no superheroes found', async () => {
            req.query = {};
            (superheroRepo.getSuperheroes as jest.Mock).mockResolvedValue({ data: [], total: 0 });

            await SuperheroController.getAllSuperheroes(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('getSuperheroById', () => {
        it('should return superhero by id', async () => {
            req.params = { id: '1' };
            const superhero = { id: 1, nickname: 'Hero' };
            (superheroRepo.getSuperheroById as jest.Mock).mockResolvedValue(superhero);

            await SuperheroController.getSuperheroById(req, res, next);

            expect(superheroRepo.getSuperheroById).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(superhero);
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error if id missing', async () => {
            req.params = {};

            await SuperheroController.getSuperheroById(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should call next with error if superhero not found', async () => {
            req.params = { id: '999' };
            (superheroRepo.getSuperheroById as jest.Mock).mockResolvedValue(null);

            await SuperheroController.getSuperheroById(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });

    describe('updateSuperhero', () => {
        it('should update superhero and return updated data', async () => {
            req.params = { id: '1' };
            req.body = { nickname: 'Updated Hero' };
            const existingSuperhero = { id: 1, nickname: 'Hero' };
            const updatedSuperhero = { id: 1, nickname: 'Updated Hero' };

            (superheroRepo.getSuperheroById as jest.Mock).mockResolvedValueOnce(existingSuperhero);
            (Superhero.update as jest.Mock) = jest.fn().mockResolvedValue([1]);
            (superheroRepo.getSuperheroById as jest.Mock).mockResolvedValueOnce(updatedSuperhero);

            await SuperheroController.updateSuperhero(req, res, next);

            expect(superheroRepo.getSuperheroById).toHaveBeenCalledWith(1);
            expect(Superhero.update).toHaveBeenCalledWith(req.body, { where: { id: '1' } });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedSuperhero);
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error if id or updates missing', async () => {
            req.params = {};
            req.body = null;

            await SuperheroController.updateSuperhero(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should call next with error if superhero not found', async () => {
            req.params = { id: '999' };
            req.body = { nickname: 'Updated Hero' };
            (superheroRepo.getSuperheroById as jest.Mock).mockResolvedValue(null);

            await SuperheroController.updateSuperhero(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });

    describe('removeSuperhero', () => {
        it('should remove superhero and respond with message', async () => {
            req.params = { id: '1' };
            const existingSuperhero = { id: 1, nickname: 'Hero' };

            (superheroRepo.getSuperheroById as jest.Mock).mockResolvedValue(existingSuperhero);
            (superheroRepo.deleteSuperhero as jest.Mock).mockResolvedValue(null);

            await SuperheroController.removeSuperhero(req, res, next);

            expect(superheroRepo.getSuperheroById).toHaveBeenCalledWith(1);
            expect(superheroRepo.deleteSuperhero).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Superhero deleted" });
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error if id missing', async () => {
            req.params = {};

            await SuperheroController.removeSuperhero(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should call next with error if superhero not found', async () => {
            req.params = { id: '999' };
            (superheroRepo.getSuperheroById as jest.Mock).mockResolvedValue(null);

            await SuperheroController.removeSuperhero(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });
});
