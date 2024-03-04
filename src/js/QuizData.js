class QuizData {
  constructor(data) {
    this.data = data;
    this.topic = null;
  }
  getTopics() {
    return this.data.map((topic) => {
      const { title, icon } = topic;
      return {
        title,
        icon,
      };
    });
  }
  getIconAndTitle(topic) {
    const data = this.getDataFromTopic(topic)[0];
    return { title: data.title, icon: data.icon };
  }
  getDataFromTopic(topic) {
    return this.data.filter((item) => item["title"] === topic);
  }
}
export default QuizData;
