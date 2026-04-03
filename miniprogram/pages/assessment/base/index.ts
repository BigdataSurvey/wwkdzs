Page({
  data: {
    questions: [] as any[],
    currentIndex: 0,
    answers: [] as any[],
    progress: 0,
    isLoading: true,
    industryId: 0,
    stageKey: ''
  },

  onLoad(options: any) {
    const { industryId, stageKey } = options;
    this.setData({ 
      industryId: Number(industryId) || 0,
      stageKey: stageKey || ''
    });
    this.fetchQuestions();
  },

  async fetchQuestions() {
    wx.showLoading({ title: '加载个性化题库...', mask: true });
    try {
      const res = await wx.cloud.callFunction({
        name: 'getQuestionnaire',
        data: { 
          type: 'base',
          industryId: this.data.industryId,
          stageKey: this.data.stageKey
        }
      });

      const result = res.result as any;
      if (result && result.code === 0 && result.data && result.data.length > 0) {
        this.setData({
          questions: result.data,
          isLoading: false
        });
        this.updateProgress();
      } else {
        this.setData({ isLoading: false });
      }
    } catch (err) {
      console.error('云端拉取题目失败:', err);
      this.setData({ isLoading: false });
    } finally {
      wx.hideLoading();
    }
  },

  // 🚨 核心修复：找回缺失的“重新选择行业”方法
  goSelectIndustry() {
    wx.navigateBack({
      delta: 1,
      fail: () => {
        // 如果无法后退，直接重定向到选择页
        wx.redirectTo({ url: '/pages/industry-stage/index' });
      }
    });
  },

  selectOption(e: any) {
    const { optionid, score } = e.currentTarget.dataset;
    const { questions, currentIndex, answers } = this.data;

    const newAnswers = [...answers];
    newAnswers[currentIndex] = {
      questionId: questions[currentIndex].id,
      optionId: optionid,
      score: score
    };

    this.setData({ answers: newAnswers });

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
    const totalScore = answers.reduce((sum, item) => sum + item.score, 0);
    wx.showLoading({ title: '正在分析经营风险...' });

    setTimeout(() => {
      wx.hideLoading();
      wx.redirectTo({
        url: `/pages/result/index?score=${totalScore}&type=base&industryId=${this.data.industryId}`
      });
    }, 1500);
  }
});