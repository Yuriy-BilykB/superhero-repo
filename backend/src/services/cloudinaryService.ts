import {cloudinary} from "../utils/cloudinary";

export const uploadToCloudinary = async (
    fileBuffer: Buffer,
    folder = 'superheroesImages'
): Promise<{ secure_url: string; public_id: string }> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {folder},
            (error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new Error("Cloudinary upload failed"));
                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        );
        stream.end(fileBuffer);
    });
};

export const deleteFromCloudinary = async (publicId: string) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
};