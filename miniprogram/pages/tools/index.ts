Page({
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
  },

  data: {
    tools: [
      {
        id: 'profit',
        title: '利润测算器',
        desc: '核算固定成本、毛利和盈亏平衡点，算清楚再投钱',
        tag: '核心工具',
        tagColor: '#2E6BFF',
        tagBg: 'rgba(46,107,255,0.08)',
        icon: '📊',
        iconBg: 'linear-gradient(135deg, #EBF1FF, #DBEAFE)',
        path: '/pages/tools/profit/index',
        highlight: true,
        isNew: false,
        proHint: 'PRO版支持多场景测算和完整利润分析报告',
      },
      {
        id: 'guide',
        title: '开店避坑指南',
        desc: '按行业和阶段整理高频踩坑点，提前知道坑在哪',
        tag: '实用指南',
        tagColor: '#10B981',
        tagBg: 'rgba(16,185,129,0.08)',
        icon: '🛡️',
        iconBg: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
        path: '/pages/tools/guide/index',
        highlight: false,
        isNew: false,
        proHint: 'PRO版查看完整行业避坑手册，含50+坑点',
      },
      {
        id: 'survival',
        title: '存活率参考',
        desc: '同行业同城市的店铺存活率数据，心里有个底',
        tag: '数据参考',
        tagColor: '#F59E0B',
        tagBg: 'rgba(245,158,11,0.08)',
        icon: '📈',
        iconBg: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
        path: '/pages/tools/survival/index',
        highlight: false,
        isNew: false,
        proHint: 'PRO版查看同商圈精准存活率数据',
      },
      {
        id: 'cashflow',
        title: '现金流模拟器',
        desc: '模拟不同经营场景下的现金流变化，提前预警断裂风险',
        tag: '新功能',
        tagColor: '#FF2D55',
        tagBg: 'rgba(255,45,85,0.08)',
        icon: '💸',
        iconBg: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)',
        path: '/pages/tools/cashflow/index',
        highlight: false,
        isNew: true,
        proHint: 'PRO版支持多变量压力测试和优化方案',
      },
      {
        id: 'more',
        title: '更多工具',
        desc: '证照清单、活动模板、排班表等实用工具持续更新中',
        tag: '持续更新',
        tagColor: '#8B5CF6',
        tagBg: 'rgba(139,92,246,0.08)',
        icon: '✨',
        iconBg: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)',
        path: '/pages/tools/more/index',
        highlight: false,
        isNew: false,
        proHint: '',
      }
    ]
  },

  openTool(e: any) {
    const path = e.currentTarget.dataset.path;
    wx.navigateTo({ url: path });
  }
});
