import { Predicate } from 'isomorphic-validation';
import isLength from 'validator/es/lib/isLength';

const isMaxLength = (max) => Predicate(
  (value) => isLength(value, { max }),
  {
    err: `Should not be longer than ${max} characters.`
  }
);

export default isMaxLength;