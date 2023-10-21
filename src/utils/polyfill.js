/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2018-06-06 20:07:41
 * @description: polyfill
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');

if (typeof Array.prototype.includes !== 'function') {
    Array.prototype.includes = function(v) {
        return this.indexOf(v) !== -1
    };
}
if (typeof String.prototype.includes !== 'function') {
    String.prototype.includes = function(v) {
        return this.indexOf(v) !== -1
    };
}
if (typeof String.prototype.startsWith !== 'function') {
    String.prototype.startsWith = function(v) {
        return this.indexOf(v) === 0
    };
}