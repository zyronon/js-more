let randomList = Array.from({length: 20});
randomList.map((item, index) => {
  randomList[index] = Math.floor(Math.random() * 100);
});

export default randomList