import { Predicate } from 'isomorphic-validation';
import equals from 'validator/es/lib/equals';

export default Predicate(
  equals, 
  { 
    err: 'Password and password confirmation must be the same',
  }
);