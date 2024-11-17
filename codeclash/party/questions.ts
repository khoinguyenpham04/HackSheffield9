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
	explanation: "The array methods push() and unshift() modify the original array. push(4) adds 4 to the end, making it [1,2,3,4]. Then unshift(0) adds 0 to the beginning, resulting in [0,1,2,3,4]. These methods modify the array in place, in the order they are called."
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
	explanation: "The Promise chain starts with Promise.resolve(1), then adds 1 making it 2, then multiplies by 2 making it 4. Each .then() takes the result of the previous Promise and passes it to the next function in the chain. The final console.log prints 4."
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
	explanation: "Both elements in the array reference the same object in memory. When we modify arr[1].a = 2, we're changing the shared object's property. Since arr[0] points to the same object, arr[0].a will also be 2. This demonstrates how object references work in JavaScript."
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
	explanation: "The reduce() method executes a reducer function on each element of the array, with an initial value of 0. It accumulates: 0+1=1, 1+2=3, 3+3=6, 6+4=10, and finally 10+5=15. The reducer function adds each number to the running sum."
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
	explanation: "When an async function is called, it always returns a Promise, regardless of what's inside the function. Even though the function returns a string 'Hello', console.log(example()) shows the Promise wrapper. To get the actual value, you would need to either await the function or use .then()."
  }
]
