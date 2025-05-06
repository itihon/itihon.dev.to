import { Validation } from 'isomorphic-validation';
import emailV from '../validations/email.js';
import passwordV from '../validations/password.js';
import isPasswordConfirmed from '../validators/is-password-confirmed.js';
import isEmailNotRegistered from '../validators/is-email-not-registered.js';
import applyEffects from '../ui/apply-effects.js';

const pwdConfirm = Validation();

/** Creating profiles */

const [signupForm, signupV] = Validation.profile(
  '[name="signupForm"]',
  ['email', 'password', 'pwdConfirm'],
  [emailV, passwordV, pwdConfirm],
);

signupV.email.client.constraint(isEmailNotRegistered, { debounce: 5000 });

Validation.glue(signupV.password, signupV.pwdConfirm)
  .constraint(isPasswordConfirmed);

  /** UI effects */

applyEffects([signupForm, signupV]);

export { signupForm, signupV };
