type Func = (x: any) => any;

const compose = (...fns: Func[]) => (x: any): any => fns.reduceRight((v, f) => f(v), x);

// use case example
const addFn = (x: number): number => x + 1;
const multiplyFn = (x: number): number => x * 2;
const subtractFn = (x: number): number => x - 3;
const divideFn = (x: number): number => x / 4;

const resultFn = compose(addFn, multiplyFn, subtractFn, divideFn)(10);