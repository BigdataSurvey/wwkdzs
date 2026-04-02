import { setUserProfile, getUserProfile } from '../../utils/storage'

Page({
  data: {
    loading: false
  },

  onLoad() {
    // 如果已经有本地登录记录，直接跳过
    const profile = getUserProfile()
    if (profile && profile.openid) {
      wx.switchTab({ url: '/pages/index/index' })
    }
  },

  onLogin() {
    if (this.data.loading) return
    this.setData({ loading: true })

    wx.cloud.callFunction({ name: 'login' })
      .then((res: any) => {
        const openid = res.result && res.result.openid
        if (!openid) {
          wx.showToast({ title: '登录失败，请重试', icon: 'none' })
          this.setData({ loading: false })
          return
        }

        const profile = {
          nickName: `用户${String(openid).slice(-4)}`,
          avatarUrl: '/images/logo.png',
          openid
        }
        setUserProfile(profile)
        getApp<IAppOption>().globalData.userProfile = profile

        wx.showToast({ title: '登录成功', icon: 'success' })
        setTimeout(() => {
          wx.switchTab({ url: '/pages/index/index' })
        }, 600)
      })
      .catch((err: any) => {
        console.error('登录失败', err)
        wx.showToast({ title: '登录失败，请重试', icon: 'none' })
        this.setData({ loading: false })
      })
  },

  onMockLogin() {
    const profile = {
      nickName: '演示用户',
      avatarUrl: '/images/logo.png',
      openid: 'mock_' + Date.now()
    }
    setUserProfile(profile)
    getApp<IAppOption>().globalData.userProfile = profile
    wx.switchTab({ url: '/pages/index/index' })
  }
})
