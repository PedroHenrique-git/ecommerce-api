import { HOST } from '../../constants';

export function generateImageUrl(filename: string) {
  return `${HOST}/images/products/${filename}`;
}
