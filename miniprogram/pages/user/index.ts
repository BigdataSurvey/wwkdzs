import { getUserProfile, getDiagnosisRecords, getFavorites } from '../../utils/storage'

Page({
  data: {
    userInfo: {
      nickName: '微信用户',
      avatarUrl: '/images/logo.png'
    },
    stats: [
      { label: '已保存报告', value: '0' },
      { label: '已收藏指南', value: '0' }
    ],
    menus: [
      { title: '联系我们', desc: '商务合作、反馈入口、服务信息', path: '/pages/contact/contact' },
      { title: '问题反馈', desc: '提交 UI、内容、功能建议', path: '/pages/feedback/index' },
      { title: '深度诊断规划', desc: '下一版通过广告解锁或裂变解锁', path: '' }
    ]
  },

  onShow() {
    const profile = getUserProfile()
    const records = getDiagnosisRecords()
    const favorites = getFavorites()

    this.setData({
      userInfo: profile || { nickName: '微信用户', avatarUrl: '/images/logo.png' },
      stats: [
        { label: '已保存报告', value: String(records.length) },
        { label: '已收藏指南', value: String(favorites.length) }
      ]
    })
  },

  onMenuTap(e: any) {
    const path = e.currentTarget.dataset.path
    if (path) {
      wx.navigateTo({ url: path })
      return
    }
    wx.showModal({
      title: '深度诊断规划',
      content: 'V1 先聚焦基础诊断完成率。深度诊断保留到下一版，再作为广告解锁或裂变解锁能力上线。',
      showCancel: false
    })
  }
})
