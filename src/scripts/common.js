console.log('Begin JS');

let add = (a, b) => a + b;
console.log(add(5, 4));




async function start() {
  return await Promise.resolve('async is working')
}

start().then(console.log)


class Util {
  static id = Date.now()
}

console.log('Util Id:', Util.id)

console.log(...[0, 1, 2].map(x => x*x))

console.log('End JS');
