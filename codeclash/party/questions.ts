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
	explanation: "test explanation"
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
	explanation: "very much a test explanation"
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
	explanation: "are you even reading this?"
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
	explanation: "testing"
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
	explanation: "meow"
  }
]
