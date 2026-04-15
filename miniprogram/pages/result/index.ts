const RISK_THEME = {
  high: {
    level: '高风险', color: '#FF4D4F', bg: 'rgba(255,77,79,0.08)',
    shadow: 'rgba(255,77,79,0.25)', border: 'rgba(255,77,79,0.15)',
    icon: '🔴', conclusion: '这个店现在开，90% 会亏损',
    advice: '先解决下方核心隐患再做决定',
  },
  mid: {
    level: '中等风险', color: '#FAAD14', bg: 'rgba(250,173,20,0.08)',
    shadow: 'rgba(250,173,20,0.25)', border: 'rgba(250,173,20,0.15)',
    icon: '🟡', conclusion: '有盈利可能，但致命坑必须避开',
    advice: '优先处理高风险项',
  },
  low: {
    level: '低风险', color: '#52C41A', bg: 'rgba(82,196,26,0.08)',
    shadow: 'rgba(82,196,26,0.25)', border: 'rgba(82,196,26,0.15)',
    icon: '🟢', conclusion: '恭喜！你的开店计划非常稳妥',
    advice: '可直接查看深度诊断',
  },
};

Page({
  data: {
    score: 0,
    displayScore: 0,
    type: 'base',
    industryId: 0,
    level: '',
    levelColor: '',
    levelBg: '',
    levelShadow: '',
    riskBorderColor: '',
    levelIcon: '',
    conclusion: '',
    advice: '',
    sourceLabel: '',
    riskStructure: [] as any[],
    issues: [] as any[],
    issuesUnlocked: false,
    allExpanded: false,
  },

  scoreTimer: null as number | null,

  onLoad(options: any) {
    const score = Number(options.score) || 30;
    const type = options.type || 'base';
    const industryId = Number(options.industryId) || 0;

    let themeKey: keyof typeof RISK_THEME = 'high';
    if (score >= 80) themeKey = 'low';
    else if (score >= 60) themeKey = 'mid';

    const theme = RISK_THEME[themeKey];

    const selection = wx.getStorageSync('selectionState') || {};
    const industryName = selection.industryName || '餐饮';
    const stageName = selection.stageName || '筹备期';
    const sourceLabel = `${industryName} · ${stageName} · ${type === 'pro' ? '深度诊断' : '基础排雷'}`;

    const riskStructure = [
      { icon: '💰', title: '资金链路', tag: '高风险', tagClass: 'rtag-high', desc: '启动资金存在缺口或高杠杆，在行业平均回本期内容易发生资金链断裂。建议至少预留3个月房租+人力备用金。', expanded: false },
      { icon: '👤', title: '操盘经验', tag: '高风险', tagClass: 'rtag-high', desc: '跨行创业面临选址、供应链盲区，试错成本比行业平均高40%。建议先去同类型店铺积累1-2个月经验。', expanded: false },
      { icon: '📍', title: '选址客流', tag: '中风险', tagClass: 'rtag-mid', desc: '目标商圈客流数据尚未充分验证，存在客流预估偏差风险。建议实地蹲点3天统计真实客流。', expanded: false },
      { icon: '🏪', title: '竞争格局', tag: '待评估', tagClass: 'rtag-grey', desc: '周边同类型店铺密度和差异化程度尚需进一步调研评估。', expanded: false },
      { icon: '📊', title: '盈利模型', tag: '中风险', tagClass: 'rtag-mid', desc: '当前定价策略和成本结构下，毛利率偏低，需优化供应链或调整产品结构。', expanded: false },
    ];

    const issues = [
      { idx: 1, text: '启动资金依赖借贷，杠杆过高', consequence: '行业内因此倒闭的店铺占比65%', suggestion: '降低借贷比例至50%以下', tag: '高风险', tagClass: 'itag-high', tagIcon: '🔴' },
      { idx: 2, text: '行业经验不足，跨行试错成本高', consequence: '选址和供应链试错成本比行业平均高40%', suggestion: '先去同类店铺积累1-2个月经验', tag: '高风险', tagClass: 'itag-high', tagIcon: '🔴' },
      { idx: 3, text: '选址客流预估偏差', consequence: '实际客流可能低于预期30%以上', suggestion: '实地蹲点3天统计真实客流', tag: '中风险', tagClass: 'itag-mid', tagIcon: '🟡' },
      { idx: 4, text: '竞品密度过高', consequence: '同商圈同品类超过5家，分流严重', suggestion: '调研差异化定位或更换选址', tag: '待评估', tagClass: 'itag-grey', tagIcon: '⚪' },
    ];

    this.setData({
      score, type, industryId,
      level: theme.level,
      levelColor: theme.color,
      levelBg: theme.bg,
      levelShadow: theme.shadow,
      riskBorderColor: theme.border,
      levelIcon: theme.icon,
      conclusion: theme.conclusion,
      advice: theme.advice,
      sourceLabel,
      riskStructure,
      issues,
    });

    this.animateScore(score);
  },

  animateScore(target: number) {
    let current = 0;
    const duration = 1200;
    const frameMs = 30;
    const totalFrames = Math.ceil(duration / frameMs);
    const increment = target / totalFrames;
    let frame = 0;

    this.scoreTimer = setInterval(() => {
      frame++;
      current = Math.min(Math.round(increment * frame), target);
      this.setData({ displayScore: current });
      if (current >= target) {
        clearInterval(this.scoreTimer!);
        this.scoreTimer = null;
      }
    }, frameMs) as unknown as number;
  },

  onUnload() {
    if (this.scoreTimer) {
      clearInterval(this.scoreTimer);
      this.scoreTimer = null;
    }
  },

  toggleRiskPanel(e: any) {
    const idx = e.currentTarget.dataset.idx;
    const key = `riskStructure[${idx}].expanded`;
    const current = this.data.riskStructure[idx].expanded;
    this.setData({ [key]: !current });
  },

  expandAllPanels() {
    const rs = this.data.riskStructure.map((item: any) => ({ ...item, expanded: true }));
    this.setData({ riskStructure: rs, allExpanded: true });
  },

  collapseAllPanels() {
    const rs = this.data.riskStructure.map((item: any) => ({ ...item, expanded: false }));
    this.setData({ riskStructure: rs, allExpanded: false });
  },

  unlockIssuesViaShare() {
    this.setData({ issuesUnlocked: true });
    wx.showToast({ title: '全部隐患已解锁', icon: 'success' });
  },

  reTest() {
    try { wx.removeStorageSync('exam_progress_base'); } catch (e) {}
    const selection = wx.getStorageSync('selectionState') || {};
    const stageKey = selection.stageKey || '';
    wx.redirectTo({
      url: `/pages/assessment/base/index?industryId=${this.data.industryId}&stageKey=${stageKey}`
    });
  },

  onUnlockPro() {
    wx.setStorageSync('proUnlocked', true);
    wx.showToast({ title: 'PRO 已解锁！', icon: 'success', duration: 1500 });
    setTimeout(() => {
      wx.switchTab({ url: '/pages/index/index' });
    }, 1200);
  },

  onShareAppMessage() {
    const score = this.data.score;
    let title = `我测了开店风险：${score}分，你也来试试！`;
    if (score < 60) title = `${score}分高风险！我差点踩坑，你也来测测`;
    else if (score < 80) title = `开店风险${score}分，你敢不敢测？`;
    this.unlockIssuesViaShare();
    return { title, path: '/pages/index/index' };
  },

  onShareTimeline() {
    return { title: `开店前必做的风险体检，我得了${this.data.score}分` };
  },

  onSaveImage() {
    wx.showActionSheet({
      itemList: ['保存诊断截图到相册'],
      success: () => {
        wx.showLoading({ title: '正在生成...', mask: true });
        setTimeout(() => {
          wx.hideLoading();
          wx.showToast({ title: '海报生成功能即将上线', icon: 'none', duration: 2000 });
        }, 500);
      }
    });
  },
});
