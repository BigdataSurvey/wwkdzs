Page({
  data: {
    score: 0,
    type: 'base',
    industryId: 0,
    level: '高风险',
    levelColor: '#FF4D4F',
    levelBg: 'rgba(255, 77, 79, 0.1)', // 🚨 安全输出背景色，坚决不毒害渲染层
    navHeight: 88,
    statusBarHeight: 20
  },

  onLoad(options: any) {
    const score = Number(options.score) || 30;
    const type = options.type || 'base';
    const industryId = Number(options.industryId) || 0;

    let level = '高风险';
    let levelColor = '#FF4D4F';
    let levelBg = 'rgba(255, 77, 79, 0.1)';

    if (score >= 80) {
      level = '低风险';
      levelColor = '#10B981';
      levelBg = 'rgba(16, 185, 129, 0.1)';
    } else if (score >= 60) {
      level = '中等风险';
      levelColor = '#F59E0B';
      levelBg = 'rgba(245, 158, 11, 0.1)';
    }

    const windowInfo = wx.getWindowInfo();
    const menuButton = wx.getMenuButtonBoundingClientRect();
    const navHeight = menuButton.height + (menuButton.top - windowInfo.statusBarHeight) * 2;

    this.setData({
      score, type, industryId, level, levelColor, levelBg,
      statusBarHeight: windowInfo.statusBarHeight,
      navHeight
    });
  },

  // 🚨 完美匹配 WXML，wx.switchTab 保证退回首页绝对不报错！
  goHome() { wx.switchTab({ url: '/pages/index/index' }); },
  reTest() { wx.redirectTo({ url: `/pages/assessment/base/index?industryId=${this.data.industryId}` }); }
});