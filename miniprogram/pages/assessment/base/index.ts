// miniprogram/pages/assessment/base/index.ts
Page({
  data: {
    questions: [] as any[],
    currentIndex: 0,
    answers: [] as any[],
    progress: 0,
    isLoading: true,
    industryId: 0,
    stageKey: '',
    navHeight: 88,
    statusBarHeight: 20
  },

  onLoad(options: any) {
    const { industryId, stageKey } = options;
    this.setData({ industryId: Number(industryId) || 0, stageKey: stageKey || '' });

    const windowInfo = wx.getWindowInfo();
    const menuButton = wx.getMenuButtonBoundingClientRect();
    const navHeight = menuButton.height + (menuButton.top - windowInfo.statusBarHeight) * 2;
    this.setData({ statusBarHeight: windowInfo.statusBarHeight, navHeight });

    this.fetchQuestions();
  },

  async fetchQuestions() {
    wx.showNavigationBarLoading(); // 用顶部原生极简小动画代替黑块
    try {
      const res = await wx.cloud.callFunction({
        name: 'getQuestionnaire',
        data: { type: 'base', industryId: this.data.industryId, stageKey: this.data.stageKey }
      });
      const result = res.result as any;
      if (result && result.code === 0 && result.data && result.data.length > 0) {
        this.setData({ questions: result.data, isLoading: false });
        this.updateProgress();
      } else {
        this.setData({ isLoading: false });
      }
    } catch (err) {
      this.setData({ isLoading: false });
    } finally {
      wx.hideNavigationBarLoading();
    }
  },

  saveAndExit() {
    wx.showModal({
      title: '保存进度',
      content: '已保存当前答题进度，下次进入可继续作答',
      confirmText: '退出',
      confirmColor: '#2E6BFF',
      success: (res) => { if (res.confirm) wx.navigateBack({ delta: 1 }); }
    });
  },

  goSelectIndustry() {
    wx.navigateBack({ fail: () => { wx.redirectTo({ url: '/pages/industry-stage/index' }); }});
  },

  selectOption(e: any) {
    const { optionid, score } = e.currentTarget.dataset;
    const { questions, currentIndex, answers } = this.data;

    if (answers[currentIndex] && answers[currentIndex].optionId === optionid) return;

    const newAnswers = [...answers];
    newAnswers[currentIndex] = {
      questionId: questions[currentIndex].id,
      optionId: optionid,
      score: score
    };

    wx.vibrateShort({ type: 'light' });
    this.setData({ answers: newAnswers });

    setTimeout(() => {
      this.nextQuestion();
    }, 400);
  },

  nextQuestion() {
    const { currentIndex, questions, answers } = this.data;
    if (currentIndex < questions.length - 1) {
      this.setData({ currentIndex: currentIndex + 1 }, () => { this.updateProgress(); });
    } else {
      this.finishAssessment(answers);
    }
  },

  updateProgress() {
    const total = this.data.questions.length;
    if (total === 0) return;
    const progress = Math.floor(((this.data.currentIndex + 1) / total) * 100);
    this.setData({ progress });
  },

  finishAssessment(answers: any[]) {
    const totalScore = answers.reduce((sum, item) => sum + item.score, 0);

    // 🚨 终极无感切换：去掉 Toast，只显示系统原生 Loading 且瞬间转场
    wx.showNavigationBarLoading();

    setTimeout(() => {
      wx.hideNavigationBarLoading();
      wx.redirectTo({
        url: `/pages/result/index?score=${totalScore}&type=base&industryId=${this.data.industryId}`
      });
    }, 600); // 缩短等待时间，体验更丝滑
  }
});