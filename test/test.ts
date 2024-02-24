function findErrorNums(nums) {
  let map = new Map();
  nums.map((v) => {
    map.set(v, (map.get(v) || 0) + 1);
  });
  let max = 0;
  let num = 0;

  console.log(Array.from(map));
}

console.log(findErrorNums([1, 5, 3, 4, 5]));
console.log(findErrorNums([1, 1]));
console.log(findErrorNums([2, 2]));
