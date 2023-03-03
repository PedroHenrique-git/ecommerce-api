import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';

export const multerConfig: MulterOptions = {
  storage: diskStorage({
    destination: 'public/images/products',
    filename(_, file, callback) {
      const [, ext] = file.originalname.split('.');
      callback(null, `${randomUUID()}.${ext}`);
    },
  }),
};
