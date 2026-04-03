Page({
  data: {
    score: 0,
    type: 'base',
    industryId: 0,
    level: '高',
    levelColor: '#FF4D4F',
    navHeight: 88,
    statusBarHeight: 20
  },

  onLoad(options: any) {
    const score = Number(options.score) || 30;
    const type = options.type || 'base';
    const industryId = Number(options.industryId) || 0;

    // 逻辑：计算风险评级与警示色
    let level = '高风险';
    let levelColor = '#FF4D4F'; // 红/橙
    if (score >= 80) { level = '低风险'; levelColor = '#10B981'; } // 绿
    else if (score >= 60) { level = '中等风险'; levelColor = '#F59E0B'; } // 黄

    const windowInfo = wx.getWindowInfo();
    const menuButton = wx.getMenuButtonBoundingClientRect();
    const navHeight = menuButton.height + (menuButton.top - windowInfo.statusBarHeight) * 2;

    this.setData({
      score, type, industryId, level, levelColor,
      statusBarHeight: windowInfo.statusBarHeight,
      navHeight
    });
  },

  goHome() { wx.switchTab({ url: '/pages/index/index' }); },
  reTest() { wx.navigateBack({ delta: 1 }); }
});