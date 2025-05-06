import { Predicate } from 'isomorphic-validation';
import isEmail from 'validator/es/lib/isEmail';

export default Predicate(
  isEmail, 
  {
    err: 'Must be in the E-mail format.',
  }
);
