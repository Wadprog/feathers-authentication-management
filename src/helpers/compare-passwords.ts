import { compare } from 'bcryptjs';

export async function comparePasswords (
  oldPassword: string,
  password: string,
  getError?: () => unknown
): Promise<void> {
  if (!getError) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    getError = () => {};
  }
  return await new Promise((resolve, reject) => {
    compare(oldPassword, password, (err, data1) =>
      (err || !data1) ? reject(getError() ?? err) : resolve()
    );
  });
}
