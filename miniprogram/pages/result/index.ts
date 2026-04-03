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

    // 🚨 规范化的动态色阶
    let level = '高风险';
    let levelColor = '#FF4D4F'; // 红色
    if (score >= 80) { level = '低风险'; levelColor = '#10B981'; } // 绿色
    else if (score >= 60) { level = '中等风险'; levelColor = '#F59E0B'; } // 琥珀色

    const windowInfo = wx.getWindowInfo();
    const menuButton = wx.getMenuButtonBoundingClientRect();
    const navHeight = menuButton.height + (menuButton.top - windowInfo.statusBarHeight) * 2;

    this.setData({
      score, type, industryId, level, levelColor,
      statusBarHeight: windowInfo.statusBarHeight,
      navHeight
    });
  },

  goBack() { wx.navigateBack({ delta: 1 }); },
  reTest() { wx.redirectTo({ url: `/pages/assessment/base/index?industryId=${this.data.industryId}` }); }
});