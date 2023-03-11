import { unlink } from 'fs/promises';
import { verifyIfFileExists } from './verifyIfFileExists';

export async function deleteFile(completePath: string) {
  const exists = await verifyIfFileExists(completePath);

  if (!exists) return;

  await unlink(completePath);
}
