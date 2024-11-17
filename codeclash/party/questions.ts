import * as Messages from "@/types/messages"

export type Question = {info: Messages.QuestionInfo, answer: string, topic: string, explanation: string}

export const questions: Question[] = [
  {
    info: {
      questionType: "multiSelect",
      questionDescription: "What will be the output of this code?",
      codeSnippet: `const arr = [1, 2, 3];
arr.push(4);
arr.unshift(0);
console.log(arr);`,
      answerOptions: [
        "[0, 1, 2, 3, 4]",
        "[4, 3, 2, 1, 0]",
        "[1, 2, 3, 4, 0]",
        "[0, 4, 1, 2, 3]"
      ]
    },
    answer: "[0, 1, 2, 3, 4]",
    topic: "arrays",
    explanation: `Array methods execute in sequence:
1. Initial array: [1, 2, 3]
2. arr.push(4) adds an element to the end: [1, 2, 3, 4]
3. arr.unshift(0) adds an element to the beginning: [0, 1, 2, 3, 4]

Key Points:
• push() adds to the end with O(1) time complexity
• unshift() adds to the start with O(n) time complexity
• Both methods mutate the original array`
  },
  {
    info: {
      questionType: "multiSelect",
      questionDescription: "What is the result of this Promise chain?",
      codeSnippet: `Promise.resolve(1)
  .then(x => x + 1)
  .then(x => x * 2)
  .then(console.log);`,
      answerOptions: [
        "1",
        "2",
        "4",
        "undefined"
      ]
    },
    answer: "4",
    topic: "promises",
<<<<<<< HEAD
	explanation: "The Promise chain starts with Promise.resolve(1), then adds 1 making it 2, then multiplies by 2 making it 4. Each .then() takes the result of the previous Promise and passes it to the next function in the chain. The final console.log prints 4."
=======
    explanation: `Promise chain execution flow:
1. Promise.resolve(1) creates a Promise with value 1
2. First .then(x => x + 1): 1 + 1 = 2
3. Second .then(x => x * 2): 2 * 2 = 4
4. Final .then(console.log) outputs 4

Key Points:
• Each .then() waits for the previous Promise
• The return value of each .then() is automatically wrapped in a Promise
• Promise chains execute sequentially
• Values are passed through the chain`
>>>>>>> wren
  },
  {
    info: {
      questionType: "multiSelect",
      questionDescription: "What will this code output?",
      codeSnippet: `const obj = { a: 1 };
const arr = [obj, obj];
arr[1].a = 2;
console.log(arr[0].a);`,
      answerOptions: [
        "1",
        "2",
        "undefined",
        "Error"
      ]
    },
    answer: "2",
    topic: "references",
<<<<<<< HEAD
	explanation: "Both elements in the array reference the same object in memory. When we modify arr[1].a = 2, we're changing the shared object's property. Since arr[0] points to the same object, arr[0].a will also be 2. This demonstrates how object references work in JavaScript."
=======
    explanation: `Object reference behavior:
1. const obj = { a: 1 } creates one object in memory
2. [obj, obj] creates an array with two references to the same object
3. Modifying arr[1].a changes the shared object
4. arr[0].a shows 2 because both elements reference the same object

Key Points:
• Objects are passed by reference in JavaScript
• Multiple variables can point to the same object in memory
• Modifying an object through any reference affects all references
• Use Object.assign() or spread operator {...} to create separate copies`
>>>>>>> wren
  },
  {
    info: {
      questionType: "string",
      questionDescription: "What will be the value of 'result'?",
      codeSnippet: `const numbers = [1, 2, 3, 4, 5];
const result = numbers.reduce((sum, num) => sum + num, 0);`
    },
    answer: "15",
    topic: "arrays",
<<<<<<< HEAD
	explanation: "The reduce() method executes a reducer function on each element of the array, with an initial value of 0. It accumulates: 0+1=1, 1+2=3, 3+3=6, 6+4=10, and finally 10+5=15. The reducer function adds each number to the running sum."
=======
    explanation: `Array reduce calculation steps:
1. Initial accumulator value: 0
2. First iteration: 0 + 1 = 1
3. Second iteration: 1 + 2 = 3
4. Third iteration: 3 + 3 = 6
5. Fourth iteration: 6 + 4 = 10
6. Final iteration: 10 + 5 = 15

Key Points:
• reduce() executes a reducer function on each array element
• The initial value (0) is the starting accumulator value
• reduce() is perfect for array aggregation operations
• Time complexity is O(n) as it visits each element once`
>>>>>>> wren
  },
  {
    info: {
      questionType: "multiSelect",
      questionDescription: "What is the output of this async code?",
      codeSnippet: `async function example() {
  return 'Hello';
}
console.log(example());`,
      answerOptions: [
        "'Hello'",
        "Promise { 'Hello' }",
        "undefined",
        "Error"
      ]
    },
    answer: "Promise { 'Hello' }",
    topic: "async",
<<<<<<< HEAD
	explanation: "When an async function is called, it always returns a Promise, regardless of what's inside the function. Even though the function returns a string 'Hello', console.log(example()) shows the Promise wrapper. To get the actual value, you would need to either await the function or use .then()."
=======
    explanation: `Async function behavior:
1. async keyword automatically wraps the return value in a Promise
2. console.log() shows the Promise object, not the resolved value
3. To get 'Hello', you need await example() or example().then()

Key Points:
• async functions always return Promises
• The returned value is automatically Promise-wrapped
• Use await or .then() to access the actual value
• This is fundamental to JavaScript's asynchronous programming model
• console.log() shows the Promise state, not the resolved value`
>>>>>>> wren
  }
]
