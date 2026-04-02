Component({
  data: {
    selected: 0,
    tabs: [
      {
        pagePath: "/pages/index/index",
        iconPath: "/images/tabbar/home_normal.svg",
        selectedIconPath: "/images/tabbar/home_active.svg"
      },
      {
        pagePath: "/pages/tools/index",
        iconPath: "/images/tabbar/tools_normal.svg",
        selectedIconPath: "/images/tabbar/tools_active.svg"
      },
      {
        pagePath: "/pages/archive/index",
        iconPath: "/images/tabbar/archive_normal.svg",
        selectedIconPath: "/images/tabbar/archive_active.svg"
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