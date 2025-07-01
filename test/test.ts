/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
var reverseString = function (s) {
  let i = 0, j = s.length - 1;
  while (i < j) {
    [s[j], s[i]] = [s[i], s[j]];
    i++
    j--
  }
  return s
};
console.log(reverseString(["h", "e", "l", "l", "o"]))
