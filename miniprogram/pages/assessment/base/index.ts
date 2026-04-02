Page({
  data: {
    questions: [] as any[],
    currentIndex: 0,
    answers: [] as any[],
    progress: 0,
    isLoading: true,
    animationData: {} // 用于切换卡片的动画
  },

  onLoad() {
    this.fetchQuestions();
  },

  // 🚨 核心：从云端获取 15 道（目前是3道）核心排雷题
  async fetchQuestions() {
    wx.showLoading({ title: '准备排雷题库...', mask: true });
    try {
      const res = await wx.cloud.callFunction({
        name: 'getQuestionnaire',
        data: { type: 'base' }
      });

      const result = res.result as any;
      if (result.code === 0) {
        this.setData({
          questions: result.data,
          isLoading: false
        });
        this.updateProgress();
      } else {
        wx.showToast({ title: '题库加载失败', icon: 'none' });
      }
    } catch (err) {
      console.error('云端拉取题目失败:', err);
    } finally {
      wx.hideLoading();
    }
  },

  // 选择选项逻辑
  selectOption(e: any) {
    const { optionid, score } = e.currentTarget.dataset;
    const { questions, currentIndex, answers } = this.data;

    // 记录答案
    const newAnswers = [...answers];
    newAnswers[currentIndex] = {
      questionId: questions[currentIndex].id,
      optionId: optionid,
      score: score
    };

    this.setData({ answers: newAnswers });

    // 延迟 300ms 自动切题，给用户留出看中选反馈的时间
    setTimeout(() => {
      this.nextQuestion();
    }, 300);
  },

  nextQuestion() {
    const { currentIndex, questions, answers } = this.data;

    if (currentIndex < questions.length - 1) {
      this.setData({
        currentIndex: currentIndex + 1
      }, () => {
        this.updateProgress();
      });
    } else {
      // 🚨 答题结束：计算得分并跳转结果页
      this.finishAssessment(answers);
    }
  },

  updateProgress() {
    const total = this.data.questions.length;
    if (total === 0) return;
    const progress = Math.floor(((this.data.currentIndex) / total) * 100);
    this.setData({ progress });
  },

  finishAssessment(answers: any[]) {
    // 这里先简单计算总分，后续可以存入云端
    const totalScore = answers.reduce((sum, item) => sum + item.score, 0);

    wx.showLoading({ title: '正在生成排雷报告...' });

    // 模拟云端计算过程
    setTimeout(() => {
      wx.hideLoading();
      wx.redirectTo({
        url: `/pages/result/index?score=${totalScore}&type=base`
      });
    }, 1500);
  }
});