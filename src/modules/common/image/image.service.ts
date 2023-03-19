import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageService {
  constructor(private configService: ConfigService) {}

  generateImageUrl(filename: string) {
    const host = this.configService.get('infra.host');

    return `${host}/images/products/${filename}`;
  }
}
