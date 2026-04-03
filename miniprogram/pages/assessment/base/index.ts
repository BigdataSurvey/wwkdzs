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
    navHeight: 88, // 自定义导航栏高度
    statusBarHeight: 20 // 状态栏高度
  },

  onLoad(options: any) {
    const { industryId, stageKey } = options;
    this.setData({
      industryId: Number(industryId) || 0,
      stageKey: stageKey || ''
    });

    // 动态计算顶部导航栏高度
    const sysInfo = wx.getSystemInfoSync();
    const menuButton = wx.getMenuButtonBoundingClientRect();
    const navHeight = menuButton.height + (menuButton.top - sysInfo.statusBarHeight) * 2;
    this.setData({
      statusBarHeight: sysInfo.statusBarHeight,
      navHeight: navHeight
    });

    this.fetchQuestions();
  },

  async fetchQuestions() {
    wx.showLoading({ title: '加载个性化题库...', mask: true });
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
      console.error('拉取失败:', err);
      this.setData({ isLoading: false });
    } finally {
      wx.hideLoading();
    }
  },

  // 🚨 顶部“保存退出”按钮逻辑
  saveAndExit() {
    wx.showModal({
      title: '保存进度',
      content: '已保存当前答题进度，下次进入可继续作答',
      confirmText: '退出',
      confirmColor: '#2E6BFF',
      success: (res) => {
        if (res.confirm) {
          wx.navigateBack({ delta: 1 });
        }
      }
    });
  },

  goSelectIndustry() {
    wx.navigateBack({
      delta: 1,
      fail: () => { wx.redirectTo({ url: '/pages/industry-stage/index' }); }
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

    // 添加轻微震动反馈
    wx.vibrateShort({ type: 'light' });
    this.setData({ answers: newAnswers });

    // 给用户 400ms 看清楚卡片变蓝和圆圈打钩的极爽反馈
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
    wx.showLoading({ title: '正在生成排雷报告...' });
    setTimeout(() => {
      wx.hideLoading();
      wx.redirectTo({
        url: `/pages/result/index?score=${totalScore}&type=base&industryId=${this.data.industryId}`
      });
    }, 1500);
  }
});