Component({
  data: {
    selected: 0,
    tabs: [
      {
        pagePath: "/pages/index/index",
        text: "首页",
        icon: "🏠"
      },
      {
        pagePath: "/pages/tools/index",
        text: "工具箱",
        icon: "🧰"
      },
      {
        pagePath: "/pages/archive/index",
        text: "档案",
        icon: "📊"
      }
    ]
  },
  methods: {
    switchTab(e: any) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({ url });
      this.setData({ selected: data.index });
    }
  }
});