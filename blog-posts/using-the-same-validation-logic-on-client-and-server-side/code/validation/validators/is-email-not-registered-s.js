import repository from '../../repository.js';

const isEmailNotRegisteredS = async (value) => 
  !(await repository.getUserIdBy({ email: value }));

export default isEmailNotRegisteredS;
