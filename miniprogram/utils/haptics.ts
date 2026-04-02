/**
 * 轻微短震 - 用于选项点击确认
 */
export function pulse(type: 'light' | 'medium' = 'light') {
  const vibrateType = type === 'medium' ? 'medium' : 'light'
  wx.vibrateShort({ type: vibrateType as any })
}

/**
 * 错误双震动 - 用于阻断操作提示
 */
export function errorPulse() {
  wx.vibrateShort({ type: 'medium' as any })
  setTimeout(() => {
    wx.vibrateShort({ type: 'medium' as any })
  }, 100)
}

/**
 * 重震 - 用于重要结果展示
 */
export function heavyPulse() {
  wx.vibrateLong()
}

/**
 * 渐进式震动 - 用于生成报告过渡
 * @param onComplete 完成回调
 */
export function progressivePulse(onComplete?: () => void) {
  const intervals = [300, 250, 200, 150, 100, 80, 60]
  let index = 0
  
  const vibrate = () => {
    if (index >= intervals.length) {
      // 最后一次重震
      setTimeout(() => {
        wx.vibrateLong()
        onComplete?.()
      }, 100)
      return
    }
    wx.vibrateShort({ type: 'light' as any })
    setTimeout(vibrate, intervals[index])
    index++
  }
  
  vibrate()
}

/**
 * 答题选项点击反馈
 */
export function optionTick() {
  wx.vibrateShort({ type: 'light' as any })
}
