const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class t {
  constructor() {
    return Promise.resolve().then(async () => {
      await sleep(1000)
    })
  }
  
}

new t()