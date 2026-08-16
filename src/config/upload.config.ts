import { diskStorage } from 'multer';
import { extname } from 'path';

export const propertyImageUpload = {
    storage: diskStorage({
        destination: './uploads/properties',

        filename: (
            req: Express.Request,
            file: Express.Multer.File,
            callback: (error: Error | null, filename: string) => void,
        ) => {
            const filename =
                `${Date.now()}${extname(file.originalname)}`;

            console.log('Original filename:', file.originalname);
            console.log('Generated filename:', filename);

            callback(null, filename);
        },
    }),
};