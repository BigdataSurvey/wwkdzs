Page({
  data: {
    questions: [] as any[],
    currentIndex: 0,
    answers: [] as any[],
    currentSelectedId: '',
    progress: 0,
    isLoading: true,
    industryId: 0,
    stageKey: '',
    navHeight: 88,
    statusBarHeight: 20,
    contentMarginTop: 128
  },

  onLoad(options: any) {
    const { industryId, stageKey } = options;
    this.setData({ industryId: Number(industryId) || 0, stageKey: stageKey || '' });

    try {
      const windowInfo = wx.getWindowInfo();
      const menuButton = wx.getMenuButtonBoundingClientRect();
      if (menuButton && menuButton.height) {
        const navHeight = menuButton.height + (menuButton.top - windowInfo.statusBarHeight) * 2;
        this.setData({
          statusBarHeight: windowInfo.statusBarHeight,
          navHeight: navHeight,
          contentMarginTop: windowInfo.statusBarHeight + navHeight + 20
        });
      }
    } catch (e) {
      console.error('状态栏获取失败', e);
    }

    this.fetchQuestions();
  },

  async fetchQuestions() {
    wx.showLoading({ title: '远端拉取真题...', mask: true });

    try {
      const res = await wx.cloud.callFunction({
        name: 'getQuestionnaire',
        data: { type: 'base', industryId: this.data.industryId, stageKey: this.data.stageKey }
      });

      const result = res.result as any;

      if (result && result.code === 0 && result.data && result.data.length > 0) {
        const safeQuestions = JSON.parse(JSON.stringify(result.data));

        this.setData({
          questions: safeQuestions,
          isLoading: false,
          currentSelectedId: ''
        });
        this.updateProgress();
      } else {
        this.setData({ isLoading: false });
        wx.showModal({ title: '题库为空', content: '未查到题目，请检查数据库配置！', showCancel: false });
      }
    } catch (err: any) {
      this.setData({ isLoading: false });
      wx.showModal({ title: '网络崩溃', content: '拉取失败：' + (err.message || '未知异常'), showCancel: false });
    } finally {
      wx.hideLoading();
    }
  },

  saveAndExit() {
    wx.showModal({
      title: '保存进度',
      content: '已保存当前答题进度',
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
    const { questions, currentIndex, answers, currentSelectedId } = this.data;

    if (currentSelectedId === optionid) return;

    const newAnswers = [...answers];
    newAnswers[currentIndex] = {
      questionId: questions[currentIndex].id,
      optionId: optionid,
      score: score
    };

    // 🚨 这里去掉了 wx.vibrateShort 物理震动，不再抖动！

    this.setData({
      answers: newAnswers,
      currentSelectedId: optionid
    });

    setTimeout(() => { this.nextQuestion(); }, 400);
  },

  nextQuestion() {
    const { currentIndex, questions, answers } = this.data;
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      this.setData({
        currentIndex: nextIndex,
        currentSelectedId: answers[nextIndex] ? answers[nextIndex].optionId : ''
      }, () => { this.updateProgress(); });
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
    wx.showLoading({ title: '生成报告中...', mask: true });

    setTimeout(() => {
      wx.hideLoading();
      wx.redirectTo({
        url: `/pages/result/index?score=${totalScore}&type=base&industryId=${this.data.industryId}`
      });
    }, 800);
  }
});