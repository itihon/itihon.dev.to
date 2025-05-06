import { Predicate } from 'isomorphic-validation';
import isStrongPassword from 'validator/es/lib/isStrongPassword';

export default Predicate(
  isStrongPassword, 
  {
    err: 'Min. 8 symbols, 1 capital letter, 1 number, 1 special character',
  }
);
