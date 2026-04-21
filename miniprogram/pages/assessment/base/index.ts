const PROGRESS_KEY = 'exam_progress_base';

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
    wx.showLoading({ title: '正在加载专业题库...', mask: true });

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

        this.restoreProgress(safeQuestions);
        this.updateProgress();
      } else {
        this.setData({ isLoading: false });
        wx.showModal({ title: '题库为空', content: '未查到题目，请检查数据库配置！', showCancel: false });
      }
    } catch (err: any) {
      this.setData({ isLoading: false });
      wx.showModal({ title: '网络异常', content: '加载失败：' + (err.message || '未知异常'), showCancel: false });
    } finally {
      wx.hideLoading();
    }
  },

  restoreProgress(questions: any[]) {
    try {
      const saved = wx.getStorageSync(PROGRESS_KEY);
      if (!saved || !saved.answers) return;

      const sameIndustry = String(saved.industryId) === String(this.data.industryId);
      const sameStage = (saved.stageKey || '') === (this.data.stageKey || '');

      if (!sameIndustry || !sameStage) {
        wx.removeStorageSync(PROGRESS_KEY);
        return;
      }

      if (saved.answers.length > 0 && saved.currentIndex < questions.length) {
        this.setData({
          answers: saved.answers,
          currentIndex: saved.currentIndex,
          currentSelectedId: saved.answers[saved.currentIndex]
            ? saved.answers[saved.currentIndex].optionId
            : ''
        });

        wx.showToast({ title: '已恢复上次进度', icon: 'success', duration: 1500 });
      }
    } catch (e) {
      console.warn('恢复进度失败', e);
    }
  },

  saveProgress() {
    try {
      wx.setStorageSync(PROGRESS_KEY, {
        industryId: String(this.data.industryId),
        stageKey: this.data.stageKey || '',
        currentIndex: this.data.currentIndex,
        answers: this.data.answers,
        timestamp: Date.now()
      });
    } catch (e) {
      console.warn('保存进度失败', e);
    }
  },

  clearProgress() {
    try {
      wx.removeStorageSync(PROGRESS_KEY);
      wx.removeStorageSync('unfinished_exam');
    } catch (e) {}
  },

  saveAndExit() {
    this.saveProgress();
    wx.setStorageSync('unfinished_exam', true);

    wx.showToast({ title: '进度已保存', icon: 'success', duration: 1200 });
    setTimeout(() => {
      wx.navigateBack({ delta: 1 });
    }, 800);
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
      }, () => {
        this.updateProgress();
        this.saveProgress();
      });
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

    // 🚨 [深度分析后新增]：构建 AI 诊断病历
    // 从当前页面的 questions 数据中，匹配出用户选中的选项文字
    const qaRecord = answers.map((ans, index) => {
      const question = this.data.questions.find(q => q.id === ans.questionId);
      const option = question ? question.options.find((o: any) => o.id === ans.optionId) : null;
      return `第${index + 1}题：${question ? question.title : '未知问题'}\n用户回答：${option ? option.text : '未知选项'}`;
    }).join('\n\n');

    // 存入缓存，供结果页读取
    wx.setStorageSync('latest_qa_record', qaRecord);

    wx.showLoading({ title: '正在生成排雷报告...', mask: true });

    // 跳转时带上基础参数
    setTimeout(() => {
      wx.hideLoading();
      wx.redirectTo({
        url: `/pages/result/index?score=${totalScore}&type=base&industryId=${this.data.industryId}`
      });
    }, 800);
  }
});
