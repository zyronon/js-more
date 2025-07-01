var reverseStr = function (s, k) {

    let len = s.length
    let resArr = s.split("");
    for (let i = 0; i < s.length; i += 2 * k) {
        let l = i, r = i + k > len ? len : i + k;
        while (l < r--) {
            [resArr[l], resArr[r]] = [resArr[r], resArr[l]];
            l++

        }
    }
    return resArr.join("")
};
console.time()
console.log(reverseStr("abcdefg", 3));

console.log(reverseStr("abcdefg", 2));
console.timeEnd()



