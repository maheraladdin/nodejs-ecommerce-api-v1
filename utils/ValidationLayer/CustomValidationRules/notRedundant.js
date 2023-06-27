/**
 * @desc    Remove redundant values from array
 * @param   values
 * @return  {any[]}
 */
module.exports = (values) => [...new Set(values)];