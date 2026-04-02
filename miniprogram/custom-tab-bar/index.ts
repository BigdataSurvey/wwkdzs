const app = getApp<IAppOption>();

// 修复 TS2554 报错：直接传参，微信底层会自动处理兼容降级
const safeVibrate = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if (wx.vibrateShort) {
    wx.vibrateShort({ type });
  }
};

Page({
  data: {
    selection: {} as any,
    diagnosisCount: 0,
    watermarkChar: '',
    shakeIndustry: false
  },

  // 定时器引用，防止页面跳转后内存泄漏
  shakeTimer: null as number | null,

  onLoad() {
    // 页面初始化逻辑
  },

  onShow() {
    // 1. 修复自定义 TabBar 状态不同步的经典问题
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      });
    }

    // 2. 修复“空对象判空”的致命 Bug
    let selection = app.globalData.selection;
    // 如果 globalData 里是空对象（没有 key），则去拉取本地缓存
    if (!selection || Object.keys(selection).length === 0) {
      selection = wx.getStorageSync('selectionState') || {};
      // 同步回 globalData 保证全局状态一致
      app.globalData.selection = selection;
    }

    // 3. 增加数组强校验，防止 records.length 导致页面崩溃
    const records = wx.getStorageSync('diagnosisRecords');
    const safeRecordsCount = Array.isArray(records) ? records.length : 0;

    // 4. 千人千面：安全提取行业名称的第一个字
    let watermark = '';
    if (selection && selection.industryName && typeof selection.industryName === 'string') {
      watermark = selection.industryName.trim().substring(0, 1);
    }

    // 统一渲染
    this.setData({
      selection: selection,
      diagnosisCount: safeRecordsCount,
      watermarkChar: watermark
    });
  },

  onHide() {
    // 页面隐藏时清理定时器，养成良好内存管理习惯
    if (this.shakeTimer) {
      clearTimeout(this.shakeTimer);
      this.shakeTimer = null;
    }
  },

  // ========== 交互动作区 ==========

  // 去设置行业
  goSelectIndustry() {
    safeVibrate('light');
    wx.navigateTo({
      url: '/pages/industry-stage/index'
    });
  },

  // 点击核心大按钮：开始基础体检
  goBaseAssessment() {
    // 核心拦截逻辑：如果没有设置行业，绝对不让进
    if (!this.data.selection || !this.data.selection.industryId) {
      // 错误反馈：中等强度震动 + 触发 CSS 左右抖动动画
      safeVibrate('medium');
      this.setData({ shakeIndustry: true });

      wx.showToast({
        title: '请先设置行业，以匹配专属题库',
        icon: 'none',
        duration: 2000
      });

      // 500ms 后重置抖动状态，并记录 timer 防止内存泄漏
      if (this.shakeTimer) clearTimeout(this.shakeTimer);
      this.shakeTimer = setTimeout(() => {
        this.setData({ shakeIndustry: false });
      }, 500) as unknown as number;

      return;
    }

    // 成功放行：给一个踏实的确认震动
    safeVibrate('medium');
    wx.navigateTo({
      url: '/pages/assessment/base/index'
    });
  },

  // 快捷入口：去档案页
  goArchive() {
    safeVibrate('light');
    wx.switchTab({
      url: '/pages/archive/index'
    });
  },

  // 快捷入口：去工具箱
  goTools() {
    safeVibrate('light');
    wx.switchTab({
      url: '/pages/tools/index'
    });
  }
});