/**
 * Mock repository
 */

const existingEmails = new Map([ 
    ['ww@ww.ww', 1], ['xx@xx.xx', 2], ['yy@yy.yy', 3], ['zz@zz.zz', 4],
]);

export default {
    async getUserIdBy({ email = '' }) {
        return existingEmails.get(email);
    }
}
