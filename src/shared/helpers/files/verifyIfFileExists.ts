import { readFile } from 'fs';

export function verifyIfFileExists(completePath: string): Promise<boolean> {
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
