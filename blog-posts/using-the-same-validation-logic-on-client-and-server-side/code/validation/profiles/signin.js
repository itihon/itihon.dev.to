import { Validation } from 'isomorphic-validation';
import emailV from '../validations/email.js';
import passwordV from '../validations/password.js';
import applyEffects from '../ui/apply-effects.js';

/** Creating profiles */

const [signinForm, signinV] = Validation.profile(
  '[name="signinForm"]',
  ['email', 'password'],
  [emailV, passwordV],
);

/** UI effects */

applyEffects([signinForm, signinV]);

export { signinForm, signinV };
