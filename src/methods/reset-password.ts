import { BadRequest } from '@feathersjs/errors';
import makeDebug from 'debug';
import comparePasswords from '../helpers/compare-passwords';
import deconstructId from '../helpers/deconstruct-id';
import ensureObjPropsValid from '../helpers/ensure-obj-props-valid';
import ensureValuesAreStrings from '../helpers/ensure-values-are-strings';
import getUserData from '../helpers/get-user-data';
import hashPassword from '../helpers/hash-password';
import notifier from '../helpers/notifier';

import type {
  UsersArrayOrPaginated,
  IdentifyUser,
  ResetPasswordOptions,
  ResetPwdWithShortTokenOptions,
  SanitizedUser,
  Tokens,
  GetUserDataCheckProps,
  NotifierOptions
} from '../types';

const debug = makeDebug('authLocalMgnt:resetPassword');

export async function resetPwdWithLongToken (
  options: ResetPasswordOptions,
  resetToken: string,
  password: string,
  notifierOptions: NotifierOptions = {}
): Promise<SanitizedUser> {
  ensureValuesAreStrings(resetToken, password);

  return await resetPassword(
    options,
    { resetToken },
    { resetToken },
    password,
    notifierOptions
  );
}

export async function resetPwdWithShortToken (
  options: ResetPwdWithShortTokenOptions,
  resetShortToken: string,
  identifyUser: IdentifyUser,
  password: string,
  notifierOptions: NotifierOptions = {}
): Promise<SanitizedUser> {
  ensureValuesAreStrings(resetShortToken, password);
  ensureObjPropsValid(identifyUser, options.identifyUserProps);

  return await resetPassword(
    options,
    identifyUser,
    { resetShortToken },
    password,
    notifierOptions
  );
}

async function resetPassword (
  options: ResetPasswordOptions,
  identifyUser: IdentifyUser,
  tokens: Tokens,
  password: string,
  notifierOptions: NotifierOptions = {}
): Promise<SanitizedUser> {
  debug('resetPassword', identifyUser, tokens, password);

  const {
    app,
    service,
    skipIsVerifiedCheck,
    reuseResetToken,
    passwordField,
    sanitizeUserForClient
  } = options;

  const usersService = app.service(service);
  const usersServiceId = usersService.id;
  let users: UsersArrayOrPaginated;

  if (tokens.resetToken) {
    const id = deconstructId(tokens.resetToken);
    const user = await usersService.get(id);
    users = [user];
  } else if (tokens.resetShortToken) {
    users = await usersService.find({ query: Object.assign({ $limit: 2 }, identifyUser) });
  } else {
    throw new BadRequest(
      'resetToken and resetShortToken are missing. (authLocalMgnt)',
      { errors: { $className: 'missingToken' } }
    );
  }

  const checkProps: GetUserDataCheckProps = skipIsVerifiedCheck ? ['resetNotExpired'] : ['resetNotExpired', 'isVerified'];
  const user1 = getUserData(users, checkProps);

  const tokenChecks = Object.keys(tokens).map(async key => {
    if (reuseResetToken) {
      // Comparing token directly as reused resetToken is not hashed
      if (tokens[key] !== user1[key]) {
        throw new BadRequest('Reset Token is incorrect. (authLocalMgnt)', {
          errors: { $className: 'incorrectToken' }
        });
      }
    } else {
      return await comparePasswords(
        tokens[key],
        user1[key] as string,
        () =>
          new BadRequest(
            'Reset Token is incorrect. (authLocalMgnt)',
            { errors: { $className: 'incorrectToken' } }
          )
      );
    }
  });

  try {
    await Promise.all(tokenChecks);
  } catch (err) {
    if (user1.resetAttempts > 0) {
      await usersService.patch(user1[usersServiceId], {
        resetAttempts: user1.resetAttempts - 1
      });

      throw err;
    } else {
      await usersService.patch(user1[usersServiceId], {
        resetToken: null,
        resetAttempts: null,
        resetShortToken: null,
        resetExpires: null
      });

      throw new BadRequest(
        'Invalid token. Get for a new one. (authLocalMgnt)',
        { errors: { $className: 'invalidToken' } });
    }
  }

  const user2 = await usersService.patch(user1[usersServiceId], {
    password: await hashPassword(app, password, passwordField),
    resetExpires: null,
    resetAttempts: null,
    resetToken: null,
    resetShortToken: null
  });

  const user3 = await notifier(options.notifier, 'resetPwd', user2, notifierOptions);
  return sanitizeUserForClient(user3);
}
