function findErrorNums(nums) {
  const n = nums.length;
  for (const num of nums) {
    const x = (num - 1) % n;
    console.log(x);
    nums[x] += n;
    console.log(nums);
  }
  console.log(nums);
  const ret = [];
  for (const [i, num] of nums.entries()) {
    if (num <= n) {
      ret.push(i + 1);
    }
  }
  return ret;
}

console.log(findErrorNums([4, 3, 2, 7, 8, 2, 3, 1]));
// console.log(findErrorNums([1, 1]));
