console.log('Begin TS');

let isCompleted: boolean = false;

const hex: number = 0xf555d;

const test = (): void => {
  console.log(`isCompleted = ${isCompleted};   hex = ${hex.toString(16)}`);
};

test()

// isCompleted = 554
console.log(isCompleted)


console.log('End TS');
