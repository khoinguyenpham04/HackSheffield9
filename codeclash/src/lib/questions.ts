export const questions = [
  {
    info: {
      questionType: "string",
      questionDescription: "What will console.log output?",
      codeSnippet: `let x = 1;
{
  let x = 2;
  console.log(x);
}`,
      answerOptions: undefined
    },
    answer: "2"
  },
  {
    info: {
      questionType: "string",
      questionDescription: "What is the result of this expression?",
      codeSnippet: `[1, 2, 3].map(x => x * 2).reduce((a, b) => a + b, 0)`,
      answerOptions: undefined
    },
    answer: "12"
  }
]; 