# 稳稳开店助手 · 数据库初始化指南

## 前置条件
- 云开发环境 ID：`cloudbase-8geupl3d712dbad6`
- 已在微信开发者工具中登录小程序管理员账号

---

## 第一步：创建数据库集合

在微信开发者工具 → 云开发 → 数据库，依次创建以下 10 个集合：

### 1. `user_profiles` - 用户档案
**权限设置：** 仅创建者可读写

```json
{
  "_id": "openid",
  "nickName": "微信昵称",
  "avatarUrl": "头像 URL",
  "createdAt": "Date",
  "lastLoginAt": "Date",
  "selection": {
    "industryId": 1,
    "industryName": "餐饮",
    "stageKey": "prepare",
    "stageName": "筹备期"
  },
  "proUnlocked": false
}
```

### 2. `industries` - 行业配置
**权限设置：** 所有人可读，仅管理员可写

**初始数据（5 条）：**

```json
{
  "_id": "1",
  "name": "餐饮",
  "tag": "选址 / 客流 / 回本",
  "sort": 1,
  "enabled": true
}
```

```json
{
  "_id": "2",
  "name": "零售",
  "tag": "选品 / 库存 / 周转",
  "sort": 2,
  "enabled": true
}
```

```json
{
  "_id": "3",
  "name": "美业",
  "tag": "技术 / 复购 / 口碑",
  "sort": 3,
  "enabled": true
}
```

```json
{
  "_id": "4",
  "name": "轻服务业",
  "tag": "服务 / 体验 / 会员",
  "sort": 4,
  "enabled": true
}
```

```json
{
  "_id": "5",
  "name": "通用开店",
  "tag": "普适性指导",
  "sort": 5,
  "enabled": true
}
```

### 3. `stages` - 阶段配置
**权限设置：** 所有人可读，仅管理员可写

**初始数据（4 条）：**

```json
{
  "_id": "prepare",
  "name": "准备开店",
  "desc": "还在考察项目，没开始投入。",
  "sort": 1,
  "enabled": true
}
```

```json
{
  "_id": "preparing",
  "name": "正在筹备",
  "desc": "已投入资金，正在装修/招人/办证。",
  "sort": 2,
  "enabled": true
}
```

```json
{
  "_id": "opened",
  "name": "已开业",
  "desc": "门店正常营业中。",
  "sort": 3,
  "enabled": true
}
```

```json
{
  "_id": "second_store",
  "name": "想做二店",
  "desc": "已有门店，想扩张开分店。",
  "sort": 4,
  "enabled": true
}
```

### 4. `question_banks` - 题库
**权限设置：** 所有人可读，仅管理员可写

**示例数据（餐饮 - 准备开店 - 基础诊断，15 题）：**

```json
{
  "_id": "base_canyin_prepare_q1",
  "industryId": 1,
  "stageKey": "prepare",
  "type": "base",
  "title": "你是否明确目标用户是谁？",
  "desc": "至少能描述出年龄、职业、消费习惯等画像特征。",
  "sort": 1,
  "enabled": true,
  "options": [
    { "text": "非常明确，能说出具体画像", "score": 20 },
    { "text": "基本清楚，有个大致方向", "score": 12 },
    { "text": "还比较模糊，说不太准", "score": 4 }
  ]
}
```

```json
{
  "_id": "base_canyin_prepare_q2",
  "industryId": 1,
  "stageKey": "prepare",
  "type": "base",
  "title": "你选的店铺位置是否已确定？",
  "desc": "如果还没确定，请评估你当前的选址进度。",
  "sort": 2,
  "enabled": true,
  "options": [
    { "text": "已签约或已锁定意向", "score": 20 },
    { "text": "有 2-3 个备选，在对比", "score": 12 },
    { "text": "还没开始看铺", "score": 4 }
  ]
}
```

```json
{
  "_id": "base_canyin_prepare_q3",
  "industryId": 1,
  "stageKey": "prepare",
  "type": "base",
  "title": "你对目标地段的真实客流是否有数据验证？",
  "desc": "不要凭感觉，至少统计过一周不同时段的客流。",
  "sort": 3,
  "enabled": true,
  "options": [
    { "text": "已实地统计过，数据较充分", "score": 20 },
    { "text": "简单看过，心里有个底", "score": 12 },
    { "text": "主要靠周边打听和直觉", "score": 4 }
  ]
}
```

```json
{
  "_id": "base_canyin_prepare_q4",
  "industryId": 1,
  "stageKey": "prepare",
  "type": "base",
  "title": "你的启动资金来源是什么？",
  "desc": "资金来源影响你的抗风险能力和心态。",
  "sort": 4,
  "enabled": true,
  "options": [
    { "text": "自有资金，无负债压力", "score": 20 },
    { "text": "部分借款，但可控", "score": 12 },
    { "text": "大部分靠借/贷款", "score": 4 }
  ]
}
```

```json
{
  "_id": "base_canyin_prepare_q5",
  "industryId": 1,
  "stageKey": "prepare",
  "type": "base",
  "title": "你是否测算过盈亏平衡点？",
  "desc": "知道每天卖多少才能不亏钱吗？",
  "sort": 5,
  "enabled": true,
  "options": [
    { "text": "详细测算过，知道保本红线", "score": 20 },
    { "text": "粗略算过，有个大概数字", "score": 12 },
    { "text": "没算过，觉得不会差", "score": 4 }
  ]
}
```

```json
{
  "_id": "base_canyin_prepare_q6",
  "industryId": 1,
  "stageKey": "prepare",
  "type": "base",
  "title": "你的房租占比是否合理？",
  "desc": "餐饮行业房租占比建议控制在 15% 以内。",
  "sort": 6,
  "enabled": true,
  "options": [
    { "text": "占比<15%，很安全", "score": 20 },
    { "text": "占比 15-25%，需要警惕", "score": 12 },
    { "text": "占比>25%，风险很高", "score": 4 }
  ]
}
```

```json
{
  "_id": "base_canyin_prepare_q7",
  "industryId": 1,
  "stageKey": "prepare",
  "type": "base",
  "title": "你有没有预留足够的流动资金？",
  "desc": "建议预留至少 6 个月的运营资金。",
  "sort": 7,
  "enabled": true,
  "options": [
    { "text": "已预留 6 个月以上", "score": 20 },
    { "text": "预留了 3-6 个月", "score": 12 },
    { "text": "预留不足 3 个月", "score": 4 }
  ]
}
```

```json
{
  "_id": "base_canyin_prepare_q8",
  "industryId": 1,
  "stageKey": "prepare",
  "type": "base",
  "title": "你的产品/服务有没有核心竞争力？",
  "desc": "为什么顾客选择你而不是隔壁老王？",
  "sort": 8,
  "enabled": true,
  "options": [
    { "text": "有明显差异化优势", "score": 20 },
    { "text": "有一些特色，但不突出", "score": 12 },
    { "text": "跟别人差不多", "score": 4 }
  ]
}
```

```json
{
  "_id": "base_canyin_prepare_q9",
  "industryId": 1,
  "stageKey": "prepare",
  "type": "base",
  "title": "你有没有做过竞品分析？",
  "desc": "周边 3 公里内有多少同行？他们的优缺点是什么？",
  "sort": 9,
  "enabled": true,
  "options": [
    { "text": "详细调研过，知道对手强弱", "score": 20 },
    { "text": "简单了解过", "score": 12 },
    { "text": "没关注，觉得自己不一样", "score": 4 }
  ]
}
```

```json
{
  "_id": "base_canyin_prepare_q10",
  "industryId": 1,
  "stageKey": "prepare",
  "type": "base",
  "title": "你有餐饮从业经验吗？",
  "desc": "经验直接影响你的试错成本。",
  "sort": 10,
  "enabled": true,
  "options": [
    { "text": "有 3 年以上经验", "score": 20 },
    { "text": "有 1 年左右经验", "score": 12 },
    { "text": "完全小白", "score": 4 }
  ]
}
```

```json
{
  "_id": "base_canyin_prepare_q11",
  "industryId": 1,
  "stageKey": "prepare",
  "type": "base",
  "title": "你的回本预期是多久？",
  "desc": "餐饮行业合理回本周期一般为 12-18 个月。",
  "sort": 11,
  "enabled": true,
  "options": [
    { "text": "18 个月以上，接受慢回报", "score": 20 },
    { "text": "12-18 个月，比较合理", "score": 12 },
    { "text": "期望 12 个月内快速回本", "score": 4 }
  ]
}
```

```json
{
  "_id": "base_canyin_prepare_q12",
  "industryId": 1,
  "stageKey": "prepare",
  "type": "base",
  "title": "你有没有明确的营销获客计划？",
  "desc": "开业后怎么让人知道你？",
  "sort": 12,
  "enabled": true,
  "options": [
    { "text": "有完整方案，知道第一步做什么", "score": 20 },
    { "text": "有些想法，但不系统", "score": 12 },
    { "text": "没想过，觉得好吃自然有人来", "score": 4 }
  ]
}
```

```json
{
  "_id": "base_canyin_prepare_q13",
  "industryId": 1,
  "stageKey": "prepare",
  "type": "base",
  "title": "如果生意不好，你有 B 计划吗？",
  "desc": "比如转型、促销、控制成本等应对方案。",
  "sort": 13,
  "enabled": true,
  "options": [
    { "text": "有明确的止损和调整方案", "score": 20 },
    { "text": "想过一些应对措施", "score": 12 },
    { "text": "没想过，觉得不会发生", "score": 4 }
  ]
}
```

```json
{
  "_id": "base_canyin_prepare_q14",
  "industryId": 1,
  "stageKey": "prepare",
  "type": "base",
  "title": "你的合伙人/团队是否稳定？",
  "desc": "如果有合伙人，权责利分配清楚吗？",
  "sort": 14,
  "enabled": true,
  "options": [
    { "text": "单人创业或团队权责清晰", "score": 20 },
    { "text": "有合伙人，基本谈好了", "score": 12 },
    { "text": "还没细聊，先做起来再说", "score": 4 }
  ]
}
```

```json
{
  "_id": "base_canyin_prepare_q15",
  "industryId": 1,
  "stageKey": "prepare",
  "type": "base",
  "title": "家人是否支持你的创业决定？",
  "desc": "家庭支持影响你的心态和坚持度。",
  "sort": 15,
  "enabled": true,
  "options": [
    { "text": "非常支持，无后顾之忧", "score": 20 },
    { "text": "基本同意，偶有分歧", "score": 12 },
    { "text": "反对声音较大", "score": 4 }
  ]
}
```

### 5. `diagnosis_records` - 诊断记录
**权限设置：** 仅创建者可读写

无需预置数据，由云函数 `saveDiagnosis` 自动创建

### 6. `archive_tasks` - 经营档案待执行动作
**权限设置：** 仅创建者可读写

无需预置数据，由云函数 `saveDiagnosis` 自动生成

### 7. `guide_articles` - 避坑指南文章
**权限设置：** 所有人可读，仅管理员可写

可根据后续运营需求逐步添加

### 8. `favorites` - 收藏记录
**权限设置：** 仅创建者可读写

无需预置数据，由前端调用 `toggleFavorite` 云函数创建

### 9. `unlock_records` - 专业版解锁记录
**权限设置：** 仅创建者可读，管理员可写

无需预置数据，由云函数 `unlockPro` 创建

### 10. `feedbacks` - 用户反馈
**权限设置：** 仅创建者可写，管理员可读

无需预置数据，由云函数 `submitFeedback` 创建

---

## 第二步：上传云函数

在微信开发者工具中，右键点击 `functions` 目录下的每个云函数文件夹，选择 **"上传并部署：云端安装依赖"**

需要上传的云函数：
- ✅ `login` - 用户登录
- ✅ `getSelectionConfig` - 获取行业/阶段配置
- ✅ `getQuestionnaire` - 获取题库
- ✅ `saveDiagnosis` - 保存诊断结果
- ✅ `getArchive` - 获取经营档案
- ✅ `toggleTask` - 更新任务状态
- ✅ `submitFeedback` - 提交反馈
- ✅ `toggleFavorite` - 收藏/取消收藏（新增）
- ✅ `updateSelection` - 更新用户选择（新增）
- ✅ `unlockPro` - 解锁专业版（新增）

---

## 第三步：测试验证

### 3.1 测试登录流程
1. 清除小程序本地缓存
2. 进入授权页，完成微信头像选择
3. 检查云数据库 `user_profiles` 集合是否生成新记录
4. 检查是否能正常跳转到首页

### 3.2 测试行业/阶段选择
1. 进入首页，点击"立即开始诊断"
2. 选择行业和阶段
3. 检查云数据库 `user_profiles` 中的 `selection` 字段是否更新

### 3.3 测试基础测评
1. 完成 15 道答题并提交
2. 检查 `diagnosis_records` 集合是否生成新记录
3. 检查 `archive_tasks` 集合是否生成待执行动作

### 3.4 测试经营档案
1. 切换到"档案"Tab
2. 查看诊断记录和待执行动作是否正确显示
3. 点击待执行动作，检查是否能正确切换状态

---

## 第四步：数据库索引优化

为了提升查询性能，建议为以下集合创建索引：

### `user_profiles`
- `_id` (主键，默认索引)
- `openid` (唯一索引)

### `diagnosis_records`
- `openid` + `createdAt` (复合索引，降序)

### `archive_tasks`
- `openid` + `done` + `updatedAt` (复合索引)

### `favorites`
- `openid` + `targetType` + `targetId` (复合索引)

---

## 常见问题

### Q1: 上传云函数失败怎么办？
A: 检查以下几点：
1. 确认已登录微信开发者工具
2. 确认云开发环境已绑定
3. 检查 `package.json` 中依赖是否正确
4. 查看云函数日志排查错误

### Q2: 数据库权限如何设置？
A: 在微信开发者工具 → 云开发 → 数据库 → 选择集合 → 点击"数据权限"，根据本文档中的权限说明进行设置

### Q3: 如何批量导入初始数据？
A: 可以使用微信开发者工具的"导入"功能，将本文档中的 JSON 数据保存为 `.json` 文件后批量导入

---

## 下一步工作

1. ✅ 完成数据库初始化和云函数上传
2. ⏳ 将前端 Mock 数据替换为真实云函数调用
3. ⏳ 接入广告组件（激励视频 + Banner）
4. ⏳ 完善 AI 助手功能（可暂缓）
5. ⏳ 添加利润测算器真实计算逻辑

---

**重要提示：** 
- 生产环境请务必使用正式的小程序 AppID
- 数据库权限配置要严格按照最小权限原则
- 敏感操作（如删除、修改）需要在云函数中做二次校验
