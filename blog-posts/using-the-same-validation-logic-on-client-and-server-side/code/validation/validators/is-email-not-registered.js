import { Predicate } from 'isomorphic-validation';

const isEmailNotRegistered = (value) => fetch(
  '/checkemail', { method: 'post', body: new URLSearchParams({ email: value })}
).then(res => res.json());

export default Predicate(
  isEmailNotRegistered, 
  {
    err: 'The E-mail must not be already registered.',
    waitMsg: 'Wait a moment, we are checking your E-mail.',
  }
);
