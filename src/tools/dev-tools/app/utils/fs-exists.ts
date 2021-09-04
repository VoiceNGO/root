import { stat } from 'fs/promises';

export default async function exists(path: string) {
  try {
    const stats = await stat(path);
    return true;
  } catch (err) {
    return false;
  }
}
