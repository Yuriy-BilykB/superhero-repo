import { uploadToCloudinary, deleteFromCloudinary } from '../cloudinaryService';
import { cloudinary } from '../../utils/cloudinary';

jest.mock('../../utils/cloudinary');

describe('uploadToCloudinary', () => {
    it('should resolve with secure_url and public_id on success', async () => {
        const mockUploadStream = jest.fn((options, callback) => {
            process.nextTick(() => callback(null, { secure_url: 'http://url', public_id: 'public-id' }));
            return { end: jest.fn() };
        });
        (cloudinary.uploader.upload_stream as jest.Mock) = mockUploadStream;

        const buffer = Buffer.from('test');
        const result = await uploadToCloudinary(buffer);

        expect(result).toEqual({
            secure_url: 'http://url',
            public_id: 'public-id',
        });
        expect(mockUploadStream).toHaveBeenCalledWith({ folder: 'superheroesImages' }, expect.any(Function));
    });

    it('should reject if cloudinary returns error', async () => {
        const mockUploadStream = jest.fn((options, callback) => {
            process.nextTick(() => callback(new Error('Upload error'), null));
            return { end: jest.fn() };
        });
        (cloudinary.uploader.upload_stream as jest.Mock) = mockUploadStream;

        const buffer = Buffer.from('test');
        await expect(uploadToCloudinary(buffer)).rejects.toThrow('Upload error');
    });
});

describe('deleteFromCloudinary', () => {
    it('should resolve on successful deletion', async () => {
        const mockDestroy = jest.fn((publicId, callback) => {
            process.nextTick(() => callback(null, { result: 'ok' }));
        });
        (cloudinary.uploader.destroy as jest.Mock) = mockDestroy;

        const result = await deleteFromCloudinary('public-id');

        expect(result).toEqual({ result: 'ok' });
        expect(mockDestroy).toHaveBeenCalledWith('public-id', expect.any(Function));
    });

    it('should reject if cloudinary destroy returns error', async () => {
        const mockDestroy = jest.fn((publicId, callback) => {
            process.nextTick(() => callback(new Error('Delete error'), null));
        });
        (cloudinary.uploader.destroy as jest.Mock) = mockDestroy;

        await expect(deleteFromCloudinary('public-id')).rejects.toThrow('Delete error');
    });
});

