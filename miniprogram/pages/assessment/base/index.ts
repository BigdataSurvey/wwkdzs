Page({
  data: {
    questions: [] as any[],
    currentIndex: 0,
    answers: [] as any[],
    progress: 0,
    isLoading: true,
    // 保存从上个页面传来的参数
    industryId: 0,
    stageKey: ''
  },

  onLoad(options: any) {
    // 1. 接收从首页跳转传过来的行业和阶段标识
    const { industryId, stageKey } = options;
    
    this.setData({ 
      industryId: Number(industryId) || 0,
      stageKey: stageKey || ''
    });

    // 2. 开始加载对应的题库
    this.fetchQuestions();
  },

  // 🚨 核心逻辑升级：向云函数发送行业/阶段参数
  async fetchQuestions() {
    wx.showLoading({ title: '加载个性化题库...', mask: true });
    try {
      const res = await wx.cloud.callFunction({
        name: 'getQuestionnaire',
        data: { 
          type: 'base',
          industryId: this.data.industryId, // 发送行业ID
          stageKey: this.data.stageKey     // 发送阶段Key
        }
      });

      const result = res.result as any;
      if (result.code === 0) {
        this.setData({
          questions: result.data,
          isLoading: false
        });
        this.updateProgress();
      } else {
        wx.showToast({ title: '暂无对应题库', icon: 'none' });
      }
    } catch (err) {
      console.error('云端拉取题目失败:', err);
      wx.showToast({ title: '网络连接异常', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
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
      // 跳转结果页，带上得分和对应的行业信息
      wx.redirectTo({
        url: `/pages/result/index?score=${totalScore}&type=base&industryId=${this.data.industryId}`
      });
    }, 1500);
  }
});