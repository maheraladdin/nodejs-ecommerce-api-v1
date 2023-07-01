/**
 * @param {string} email - email to normalize
 * @desc: Function normalizes email by lower casing everything after @
 * @return {string} - normalized email
 */
module.exports = function (email) {
    const atInd = email.indexOf("@");
    const afterAt = email.slice(atInd);
    const beforeAt = email.slice(0, atInd);
    return beforeAt + afterAt.toLowerCase();
}