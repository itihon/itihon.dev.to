import { Validation } from 'isomorphic-validation';
import isStrongPassword from '../validators/is-strong-password.js';

const passwordV = Validation()
  .constraint(isStrongPassword);

export default passwordV;