export let list = Array.from({ length: 20 });
list.map((item, index) => {
  list[index] = Math.floor(Math.random() * 100);
});
