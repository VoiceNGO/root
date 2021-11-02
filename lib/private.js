module.exports = function(obj, key, value) {
  Object.defineProperty(obj, key, {value:value});
};
