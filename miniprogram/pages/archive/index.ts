import { pulse } from '../../utils/haptics'

Page({
  data: {
    stats: [
      { label: '最近诊断', value: '0 次' },
      { label: '待执行动作', value: '0 项' },
      { label: '最近测算', value: '0 次' }
    ],
    tasks: [] as any[],
    records: [] as any[]
  },

  async onShow() {
    // 同步自定义 tabBar 选中态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
    await this.loadArchiveData()
  },

  async loadArchiveData() {
    try {
      const res = await wx.cloud.callFunction({ name: 'getArchive' })
      const tasks = res.result.tasks || []
      const records = res.result.records || []

      const pendingCount = tasks.filter((item: any) => !item.done).length

      this.setData({
        tasks,
        records,
        stats: [
          { label: '最近诊断', value: `${records.length} 次` },
          { label: '待执行动作', value: `${pendingCount} 项` },
          { label: '最近测算', value: '0 次' } // TODO: 后续接入利润测算
        ]
      })
    } catch (err) {
      console.error('加载档案数据失败', err)
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      })
    }
  },

  async toggleTask(e: any) {
    const index = Number(e.currentTarget.dataset.index)
    const task = this.data.tasks[index]

    try {
      await wx.cloud.callFunction({
        name: 'toggleTask',
        data: {
          taskId: task._id,
          done: !task.done
        }
      })

      const tasks = this.data.tasks.slice()
      tasks[index].done = !tasks[index].done
      pulse()
      this.setData({ tasks })

      const pendingCount = tasks.filter((item: any) => !item.done).length
      this.setData({
        stats: [
          { label: '最近诊断', value: `${this.data.records.length} 次` },
          { label: '待执行动作', value: `${pendingCount} 项` },
          { label: '最近测算', value: '0 次' }
        ]
      })

      wx.showToast({
        title: task.done ? '已完成' : '已标记为待执行',
        icon: 'success'
      })
    } catch (err) {
      console.error('更新任务状态失败', err)
      wx.showToast({
        title: '操作失败，请重试',
        icon: 'none'
      })
    }
  },

  openResult() {
    wx.navigateTo({ url: '/pages/result/index?type=base&score=68&industryId=4&stageKey=prepare' })
  }
})
