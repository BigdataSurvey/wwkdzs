Page({
  data: {
    categoryIndex: 0,
    categories: ['UI建议', '功能建议', '内容问题', 'Bug反馈'],
    content: ''
  },

  onCategoryChange(e: any) {
    this.setData({
      categoryIndex: Number(e.detail.value)
    })
  },

  onInput(e: any) {
    this.setData({
      content: e.detail.value
    })
  },

  submit() {
    if (!this.data.content.trim()) {
      wx.showToast({ title: '请先填写反馈内容', icon: 'none' })
      return
    }
    wx.showToast({
      title: '已提交示例反馈',
      icon: 'success'
    })
  }
})
