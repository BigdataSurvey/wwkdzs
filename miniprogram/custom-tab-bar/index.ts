Component({
    data: {
        selected: 0,
        tabs: [
            { key: 'home', pagePath: '/pages/index/index', text: '首页', icon: '🏠' },
            { key: 'tools', pagePath: '/pages/tools/index', text: '工具箱', icon: '🧰' },
            { key: 'archive', pagePath: '/pages/archive/index', text: '我的档案', icon: '📋' }
        ]
    },

    methods: {
        switchTab(e: any) {
            const index = e.currentTarget.dataset.index
            const path = e.currentTarget.dataset.path
            if (this.data.selected === index) return

            wx.switchTab({ url: path })
            this.setData({ selected: index })
        }
    }
})
