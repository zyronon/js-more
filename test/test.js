function cc(val) {
  console.log(JSON.stringify(val));
}

var checkPossibility = function (nums) {
  const n = nums.length;
  let cnt = 0;
  for (let i = 0; i < n - 1; ++i) {
    const x = nums[i],
      y = nums[i + 1];
    if (x > y) {
      cnt++;
      if (cnt > 1) {
        return false;
      }
      if (i > 0 && y < nums[i - 1]) {
        nums[i + 1] = x;
      }
    }
  }
  return true;
};

console.log(checkPossibility([2, 2, 1, 3, 3]));
// console.log(findErrorNums([1, 1]));
