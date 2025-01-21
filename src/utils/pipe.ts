type Fn = (arg: any) => any;

const pipe = (...fns: Fn[]) => (x: any) => fns.reduce((v, f) => f(v), x);

// use case example
const add = (x: number) => x + 1;
const multiply = (x: number) => x * 2;
const subtract = (x: number) => x - 3;
const divide = (x: number) => x / 4;

const result = pipe(add, multiply, subtract, divide)(10); // 4