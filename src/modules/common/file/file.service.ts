import { Injectable } from '@nestjs/common';
import { readFile } from 'fs';
import { unlink } from 'fs/promises';

@Injectable()
export class FileService {
  async deleteFile(completePath: string) {
    const exists = await this.verifyIfFileExists(completePath);

    if (!exists) return;

    await unlink(completePath);
  }

  async verifyIfFileExists(completePath: string): Promise<boolean> {
    return new Promise((resolve) => {
      readFile(completePath, (err, data) => {
        if (!err && data) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  extractFilenameFromUrl(url: string) {
    return url.split('/').at(-1);
  }
}
