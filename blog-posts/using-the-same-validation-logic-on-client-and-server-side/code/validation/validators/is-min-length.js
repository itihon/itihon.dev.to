import { Predicate } from 'isomorphic-validation';
import isLength from 'validator/es/lib/isLength';

const isMinLength = (min) => Predicate(
  (value) => isLength(value, { min }),
  {
    err: `Must be at least ${min} characters long.`
  }
);

export default isMinLength;