const { lstat } = Deno;

/**
 * Async existance check for file return true if file exists
 * @param filePath path to file
 * @returns Promise<boolean>
 */
export async function exists(filePath: string): Promise<boolean> {
  try {
    await lstat(filePath);
    return true;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return false;
    }
    throw err;
  }
}
