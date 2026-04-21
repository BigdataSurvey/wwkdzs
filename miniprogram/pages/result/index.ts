Page({
  data: {
    score: 0,
    type: 'base',
    industryId: 0,
    level: '高风险',
    levelColor: '#FF4D4F',
    levelBg: 'rgba(255, 77, 79, 0.1)',
    navHeight: 88,
    statusBarHeight: 20,

    // 🚨 AI 专属数据状态
    aiLoading: true,
    aiReport: '',        // 完整的报告
    displayAiReport: ''  // 用于打字机一个字一个字展示的报告
  },

  onLoad(options: any) {
    const score = Number(options.score) || 30;
    const type = options.type || 'base';
    const industryId = Number(options.industryId) || 0;

    let level = '高风险';
    let levelColor = '#FF4D4F';
    let levelBg = 'rgba(255, 77, 79, 0.1)';

    if (score >= 80) {
      level = '低风险'; levelColor = '#10B981'; levelBg = 'rgba(16, 185, 129, 0.1)';
    } else if (score >= 60) {
      level = '中等风险'; levelColor = '#F59E0B'; levelBg = 'rgba(245, 158, 11, 0.1)';
    }

    try {
      const windowInfo = wx.getWindowInfo();
      const menuButton = wx.getMenuButtonBoundingClientRect();
      if (menuButton && menuButton.height) {
        const navHeight = menuButton.height + (menuButton.top - windowInfo.statusBarHeight) * 2;
        this.setData({ statusBarHeight: windowInfo.statusBarHeight, navHeight });
      }
    } catch (e) {
      console.error('获取状态栏高度失败', e);
    }

    this.setData({ score, type, industryId, level, levelColor, levelBg });

    // 🚨 页面一加载，立刻呼叫 AI
    this.fetchAIDiagnosis();
  },

  // 🚨 核心逻辑：向云函数请求 AI 报告
  async fetchAIDiagnosis() {
    const qaRecord = wx.getStorageSync('latest_qa_record');
    if (!qaRecord) {
      this.setData({ aiLoading: false, displayAiReport: '未能获取您的答题病历，无法生成AI专属分析。' });
      return;
    }

    try {
      const res = await wx.cloud.callFunction({
        name: 'getAIDiagnosis',
        data: { qaRecord, industryName: '餐饮美食' } // 这里可以根据 industryId 动态传，暂时写死演示
      });

      const result = res.result as any;
      console.log('【AI 诊断返回】:', result);

      // 云函数成功返回了内容
      if (result && result.code === 0 && result.content) {
        this.setData({ aiReport: result.content, aiLoading: false });
        // 开启炫酷打字机特效
        this.typewriterEffect(result.content);
      } else {
        this.setData({ aiLoading: false, displayAiReport: 'AI 思考时走神了，请稍后再试。' });
      }
    } catch (err) {
      console.error('AI 请求崩溃:', err);
      this.setData({ aiLoading: false, displayAiReport: '网络波动，AI 连接已断开。' });
    }
  },

  // 🚨 炫酷特效：打字机
  typewriterEffect(text: string) {
    let i = 0;
    let currentText = '';
    const timer = setInterval(() => {
      if (i < text.length) {
        currentText += text.charAt(i);
        this.setData({ displayAiReport: currentText });
        i++;
      } else {
        clearInterval(timer); // 打字结束
      }
    }, 40); // 40毫秒敲一个字，节奏感极佳
  },

  goHome() { wx.switchTab({ url: '/pages/index/index' }); },
  reTest() { wx.redirectTo({ url: `/pages/assessment/base/index?industryId=${this.data.industryId}` }); }
});