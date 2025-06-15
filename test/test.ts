const arr = [5, 3, 2, 7, 8, 34, 7, 39, 12, 56, 9, 1, 6]

function bubbleSort(arr: Array<number>) {
  const len = arr.length
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]]
      }
    }
  }
  return arr
}

function quickSortInPlace(arr, left = 0, right = arr.length - 1) {
  if (left >= right) return;

  const pivotIndex = partition(arr, left, right);
  console.log(pivotIndex)
  // quickSortInPlace(arr, left, pivotIndex - 1);
  // quickSortInPlace(arr, pivotIndex + 1, right);

  return arr
}

function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left;

  for (let j = left; j < right; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }

  [arr[i], arr[right]] = [arr[right], arr[i]];

  return i;
}

function sss(arr, left = 0, right = arr.length - 1) {
  if (left >= right) return;
  let p = b(arr, left, right);
  sss(arr, left, p - 1);
  sss(arr, p + 1, right);
  return arr
}

function b(arr, left, right) {
  let p = arr[right];
  let i = left;
  for (let j = left; j < right; j++) {
    if (arr[j] < p) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++
    }
  }
  [arr[i], arr[right]] = [arr[right], arr[i]];
  return i
}

console.log(sss(arr))
