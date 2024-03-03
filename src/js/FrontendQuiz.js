class FrontEndQuiz {
  constructor(data) {
    this.data = data;
    this.counter = 0;
    this.score = 0;
  }
  incrementCounter() {
    this.counter++;
  }
  getNextQuestion() {
    return this.data[this.counter];
  }
  compareAnswers(answer) {
    const checkAnswer = this.data[this.counter].answer === answer;
    if (checkAnswer) this.score++;
    return checkAnswer;
  }
  getScore() {
    return this.score;
  }
  getQuestionNumber() {
    return this.counter;
  }
  totalQuestions() {
    return this.data.length;
  }
  isDone() {
    return this.counter + 1 === this.totalQuestions();
  }
}

export default FrontEndQuiz;
