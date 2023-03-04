import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { randomUUID } from 'crypto';
import { diskStorage, MulterError } from 'multer';

export const multerConfig: MulterOptions = {
  fileFilter(_, file, callback) {
    if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg|webp)$/))
      callback(null, true);
    else {
      callback(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
    }
  },
  storage: diskStorage({
    destination: 'public/images/products',
    filename(_, file, callback) {
      const [, ext] = file.originalname.split('.');
      callback(null, `${randomUUID()}.${ext}`);
    },
  }),
};
