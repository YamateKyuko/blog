const arr = [100, 400, 200];
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

arr.forEach(async (v, i) => {
    await sleep(v);
    console.log(v, i);
});
console.log('finish');

await Promise.all(arr.map(async (v, i) => {
    await sleep(v);
    console.log(v, i);
}));
console.log('finish');

// const arr = [100, 400, 200];
// const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
await arr.reduce((p, v, i) => p.then(async () => {
  await sleep(v);
  console.log(v, i);
}), Promise.resolve());
console.log('finish');