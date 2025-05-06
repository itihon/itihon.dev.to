import { Validation } from 'isomorphic-validation';
import isEmail from '../validators/is-email.js';
import isMinLength from '../validators/is-min-length.js';
import isMaxLength from '../validators/is-max-length.js';

const emailV = Validation()
  .constraint(isMinLength(8), { next: false })
  .constraint(isMaxLength(48), { next: false })
  .constraint(isEmail, { next: false });

export default emailV;