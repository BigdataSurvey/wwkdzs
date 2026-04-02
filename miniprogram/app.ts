const ENV_ID = 'cloudbase-8geupl3d712dbad6'

function safeInitCloud() {
  if (!wx.cloud) {
    console.warn('当前基础库不支持云开发')
    return
  }
  wx.cloud.init({
    env: ENV_ID,
    traceUser: true
  })
}

/**
 * 静默登录：后台获取 OpenID，不阻断用户
 * 失败时生成本地临时 ID，保证业务流程不中断
 */
function silentLogin() {
  const storage = require('./utils/storage')
  const existing = storage.getUserProfile()
  if (existing && existing.openid) return // 已有档案，跳过

  wx.cloud.callFunction({ name: 'login' })
    .then((res: any) => {
      const openid = res.result && res.result.openid
      if (!openid) throw new Error('no openid')

      const profile = {
        nickName: `用户${String(openid).slice(-4)}`,
        avatarUrl: '/images/logo.png',
        openid
      }
      storage.setUserProfile(profile)
      getApp<IAppOption>().globalData.userProfile = profile
      console.log('[silentLogin] 成功', openid)
    })
    .catch((err: any) => {
      console.warn('[silentLogin] 失败，使用临时 ID', err)
      const tempId = 'temp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)
      const profile = {
        nickName: '体验用户',
        avatarUrl: '/images/logo.png',
        openid: tempId
      }
      storage.setUserProfile(profile)
      getApp<IAppOption>().globalData.userProfile = profile
    })
}

App<IAppOption>({
  globalData: {
    envId: ENV_ID,
    selection: {}
  },

  onLaunch() {
    safeInitCloud()

    const selection = wx.getStorageSync('selectionState') || {}
    const userProfile = wx.getStorageSync('userProfile') || undefined

    this.globalData.selection = selection
    this.globalData.userProfile = userProfile

    // 静默登录 —— 不阻断，不跳转
    silentLogin()
  }
})
