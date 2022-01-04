import makeDebug from 'debug';
import { BadRequest } from '@feathersjs/errors';

import { AuthenticationManagementBase } from './AuthenticationManagementBase';
import { makeDefaultOptions } from '../options';
import checkUnique from '../methods/check-unique';
import identityChange from '../methods/identity-change';
import passwordChange from '../methods/password-change';
import resendVerifySignup from '../methods/resend-verify-signup';
import { resetPwdWithLongToken, resetPwdWithShortToken } from '../methods/reset-password';
import sendResetPwd from '../methods/send-reset-pwd';
import {
  verifySignupWithLongToken,
  verifySignupWithShortToken
} from '../methods/verify-signup';
import {
  verifySignupSetPasswordWithLongToken,
  verifySignupSetPasswordWithShortToken
} from '../methods/verify-signup-set-password';

import type {
  AuthenticationManagementData,
  AuthenticationManagementServiceOptions,
  DataCheckUnique,
  DataCheckUniqueWithAction,
  DataIdentityChange,
  DataIdentityChangeWithAction,
  DataOptions,
  DataPasswordChange,
  DataPasswordChangeWithAction,
  DataResendVerifySignup,
  DataResendVerifySignupWithAction,
  DataResetPwdLong,
  DataResetPwdLongWithAction,
  DataResetPwdShort,
  DataResetPwdShortWithAction,
  DataSendResetPwd,
  DataSendResetPwdWithAction,
  DataVerifySignupLong,
  DataVerifySignupLongWithAction,
  DataVerifySignupSetPasswordLong,
  DataVerifySignupSetPasswordLongWithAction,
  DataVerifySignupSetPasswordShort,
  DataVerifySignupSetPasswordShortWithAction,
  DataVerifySignupShort,
  DataVerifySignupShortWithAction,
  SanitizedUser
} from '../types';
import type { Application } from '@feathersjs/feathers';

const debug = makeDebug('authLocalMgnt:service');

type AllResultTypes = null | SanitizedUser | AuthenticationManagementServiceOptions | unknown;

export class AuthenticationManagementService
  extends AuthenticationManagementBase<AuthenticationManagementData, AllResultTypes, AuthenticationManagementServiceOptions> {

  constructor (
    app: Application,
    options?: Partial<AuthenticationManagementServiceOptions>
  ) {
    super(app);

    const defaultOptions = makeDefaultOptions();
    this.options = Object.assign({}, defaultOptions, options);
  }

  async _checkUnique (data: DataCheckUnique): Promise<unknown> {
    return await checkUnique(
      this.optionsWithApp,
      data.value,
      data.ownId,
      data.meta
    );
  }

  async checkUnique (data: DataCheckUnique): Promise<unknown> {
    return await this._checkUnique(data);
  }

  async _identityChange (data: DataIdentityChange): Promise<SanitizedUser> {
    return await identityChange(
      this.optionsWithApp,
      data.value.user,
      data.value.password,
      data.value.changes,
      data.notifierOptions
    );
  }

  async identityChange (data: DataIdentityChange): Promise<SanitizedUser> {
    return await this._identityChange(data);
  }

  async _passwordChange (data: DataPasswordChange): Promise<SanitizedUser> {
    return await passwordChange(
      this.optionsWithApp,
      data.value.user,
      data.value.oldPassword,
      data.value.password,
      data.notifierOptions
    );
  }

  async passwordChange (data: DataPasswordChange): Promise<SanitizedUser> {
    return await this._passwordChange(data);
  }

  async _resendVerifySignup (data: DataResendVerifySignup): Promise<SanitizedUser> {
    return await resendVerifySignup(
      this.optionsWithApp,
      data.value,
      data.notifierOptions
    );
  }

  async resendVerifySignup (data: DataResendVerifySignup): Promise<SanitizedUser> {
    return await this._resendVerifySignup(data);
  }

  async _resetPasswordLong (data: DataResetPwdLong): Promise<SanitizedUser> {
    return await resetPwdWithLongToken(
      this.optionsWithApp,
      data.value.token,
      data.value.password,
      data.notifierOptions
    );
  }

  async resetPasswordLong (data: DataResetPwdLong): Promise<SanitizedUser> {
    return await this._resetPasswordLong(data);
  }

  async _resetPasswordShort (data: DataResetPwdShort): Promise<SanitizedUser> {
    return await resetPwdWithShortToken(
      this.optionsWithApp,
      data.value.token,
      data.value.user,
      data.value.password,
      data.notifierOptions
    );
  }

  async resetPasswordShort (data: DataResetPwdShort): Promise<SanitizedUser> {
    return await this._resetPasswordShort(data);
  }

  async _sendResetPassword (data: DataSendResetPwd): Promise<SanitizedUser> {
    return await sendResetPwd(
      this.optionsWithApp,
      data.value,
      data.notifierOptions
    );
  }

  async sendResetPassword (data: DataSendResetPwd): Promise<SanitizedUser> {
    return await this._sendResetPassword(data);
  }

  async _verifySignupLong (data: DataVerifySignupLong): Promise<SanitizedUser> {
    return await verifySignupWithLongToken(
      this.optionsWithApp,
      data.value,
      data.notifierOptions
    );
  }

  async verifySignupLong (data: DataVerifySignupLong): Promise<SanitizedUser> {
    return await this._verifySignupLong(data);
  }

  async _verifySignupShort (data: DataVerifySignupShort): Promise<SanitizedUser> {
    return await verifySignupWithShortToken(
      this.optionsWithApp,
      data.value.token,
      data.value.user,
      data.notifierOptions
    );
  }

  async verifySignupShort (data: DataVerifySignupShort): Promise<SanitizedUser> {
    return await this._verifySignupShort(data);
  }

  async _verifySignupSetPasswordLong (data: DataVerifySignupSetPasswordLong): Promise<SanitizedUser> {
    return await verifySignupSetPasswordWithLongToken(
      this.optionsWithApp,
      data.value.token,
      data.value.password,
      data.notifierOptions
    );
  }

  async verifySignupSetPasswordLong (data: DataVerifySignupSetPasswordLong): Promise<SanitizedUser> {
    return await this._verifySignupSetPasswordLong(data);
  }

  async _verifySignupSetPasswordShort (data: DataVerifySignupSetPasswordShort): Promise<SanitizedUser> {
    return await verifySignupSetPasswordWithShortToken(
      this.optionsWithApp,
      data.value.token,
      data.value.user,
      data.value.password,
      data.notifierOptions
    );
  }

  async verifySignupSetPasswordShort (data: DataVerifySignupSetPasswordShort): Promise<SanitizedUser> {
    return await this._verifySignupSetPasswordShort(data);
  }

  /**
   * check props are unique in the users items.
   * @param data.action action is 'checkUnique'
   * @param data.value {IdentifyUser} the user with properties, e.g. {email, username}. Props with null or undefined are ignored.
   * @param data.ownId excludes your current user from the search
   * @param data.meta.noErrMsg if return an error.message if not unique
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async _create ({ action, value, ownId, meta }: DataCheckUniqueWithAction): Promise<null>
  /**
   * change communications
   * @param action action is 'identityChange'
   * @param value { changes, password, user }
   * @param notifierOptions
   */
  async _create ({ action, value, notifierOptions }: DataIdentityChangeWithAction): Promise<SanitizedUser>
  /**
   * change password
   * @param action action is 'passwordChange'
   * @param value { oldPassword, password, user }
   * @param notifierOptions
   */
  async _create ({ action, value, notifierOptions }: DataPasswordChangeWithAction): Promise<SanitizedUser>
  /**
   * resend sign up verification notification
   * @param action action is 'resendVerifySignup'
   * @param value {IdentifyUser} the user with properties, e.g. {email}, {token: verifyToken}
   * @param notifierOptions options passed to options.notifier
   */
  async _create ({ action, value, notifierOptions }: DataResendVerifySignupWithAction): Promise<SanitizedUser>
  /**
   * forgotten password verification with long token
   * @param action action is 'resetPwdLong'
   * @param value { password, token, user }
   * @param notifierOptions
   */
  async _create ({ action, value, notifierOptions }: DataResetPwdLongWithAction): Promise<SanitizedUser>
  /**
   * forgotten password verification with short token
   * @param action action is 'resetPwdShort'
   * @param value { password, token, user }
   * @param notifierOptions
   */
  async _create ({ action, value, notifierOptions }: DataResetPwdShortWithAction): Promise<SanitizedUser>
  /**
   * send forgotten password notification
   * @param action action is 'sendResetPwd'
   * @param value { password, token }
   * @param notifierOptions
   */
  async _create ({ action, value, notifierOptions }: DataSendResetPwdWithAction): Promise<SanitizedUser>
  /**
   * sign up or identityChange verification with long token
   * @param action action is 'verifySignupLong'
   * @param value // compares to user.verifyToken
   * @param notifierOptions options passed to options.notifier
   */
  async _create ({ action, value, notifierOptions }: DataVerifySignupLongWithAction): Promise<SanitizedUser>
  /**
   * sign up or identityChange verification with short token
   * @param action action is 'verifySignupShort'
   * @param value { token, user }
   * @param notifierOptions
   */
  async _create ({ action, value, notifierOptions }: DataVerifySignupShortWithAction): Promise<SanitizedUser>
  /**
   * sign up verification and set password  with long token
   * @param action action is 'verifySignupSetPasswordLong'
   * @param value { password, token }
   * @param notifierOptions
   */
  async _create ({ action, value, notifierOptions }: DataVerifySignupSetPasswordLongWithAction): Promise<SanitizedUser>
  /**
   * sign up verification and set password with short token
   * @param action action is 'verifySignupSetPasswordShort'
   * @param value { password, token, user }
   * @param notifierOptions
   */
  async _create ({ action, value, notifierOptions }: DataVerifySignupSetPasswordShortWithAction): Promise<SanitizedUser>
  /**
   * get options for AuthenticationManagement
   * @param action action is 'options'
   */
  async _create ({ action }: DataOptions): Promise<AuthenticationManagementServiceOptions>
  async _create (data: AuthenticationManagementData): Promise<AllResultTypes> {
    debug(`create called. action=${data.action}`);

    try {
      if (data.action === 'checkUnique') {
        return await this._checkUnique(data);
      } else if (data.action === 'resendVerifySignup') {
        return await this._resendVerifySignup(data);
      } else if (data.action === 'verifySignupLong') {
        return await this._verifySignupLong(data);
      } else if (data.action === 'verifySignupShort') {
        return await this._verifySignupShort(data);
      } else if (data.action === 'verifySignupSetPasswordLong') {
        return await this._verifySignupSetPasswordLong(data);
      } else if (data.action === 'verifySignupSetPasswordShort') {
        return await this._verifySignupSetPasswordShort(data);
      } else if (data.action === 'sendResetPwd') {
        return await this._sendResetPassword(data);
      } else if (data.action === 'resetPwdLong') {
        return await this._resetPasswordLong(data);
      } else if (data.action === 'resetPwdShort') {
        return await this._resetPasswordShort(data);
      } else if (data.action === 'passwordChange') {
        return await this._passwordChange(data);
      } else if (data.action === 'identityChange') {
        return await this._identityChange(data);
      } else if (data.action === 'options') {
        return this.options;
      }
    } catch (err) {
      return await Promise.reject(err);
    }

    throw new BadRequest(
      //@ts-expect-error action is of type never
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Action '${data.action}' is invalid.`,
      { errors: { $className: 'badParams' } }
    );
  }
}
