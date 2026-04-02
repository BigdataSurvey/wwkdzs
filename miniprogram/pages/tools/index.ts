Page({
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
  },

  data: {
    primaryTools: [
      {
        title: '利润测算器',
        desc: '先核算固定成本、毛利和盈亏平衡点，再决定要不要投。',
        tag: 'Step 1',
        path: '/pages/tools/profit/index'
      },
      {
        title: '开店避坑指南',
        desc: '按行业和阶段整理高频踩坑点，首版先放静态内容。',
        tag: 'Step 2',
        path: '/pages/tools/guide/index'
      },
      {
        title: '存活率参考',
        desc: '后续接数据库后按行业拉取参考区间，当前先展示结构示例。',
        tag: '参考',
        path: '/pages/tools/survival/index'
      },
      {
        title: '更多工具',
        desc: '证照 checklist、活动模板、排班模板和岗位配置表后续扩展。',
        tag: '延伸',
        path: '/pages/tools/more/index'
      }
    ]
  },

  openTool(e: any) {
    const path = e.currentTarget.dataset.path
    wx.navigateTo({ url: path })
  }
})
