# 稳稳开店助手 · 5 分钟快速上手指南

## 🎯 目标
用 5 分钟时间完成项目初始化和基础测试，看到程序运行效果。

---

## ⏱️ Step 1: 打开项目（30 秒）

1. 打开 **微信开发者工具**
2. 导入项目：选择 `E:\Work\Wechat\miniapp\wwkdzs` 目录
3. 确认小程序 AppID 已绑定（必须使用正式 AppID）

---

## ⏱️ Step 2: 开通云开发（2 分钟）

### 2.1 开通环境
1. 点击顶部菜单 **"云开发"** 按钮
2. 如果提示未开通，点击 **"开通云开发"**
3. 选择 **"低配版"** 或按需选择版本
4. 等待环境创建完成

### 2.2 确认环境 ID
1. 在云开发控制台左上角查看环境 ID
2. 确认是否为：`cloudbase-8geupl3d712dbad6`
3. 如果不是，需要修改以下文件中的 `ENV_ID`:
   - `miniprogram/app.ts` 第 1 行
   - `cloudbaserc.json` 第 2 行

---

## ⏱️ Step 3: 创建数据库集合（1 分钟）

### 快速方式（推荐）

在微信开发者工具 → 云开发 → 数据库，依次创建以下集合：

1. 点击 **"+"** 创建集合
2. 输入集合名称，点击确定

**需要创建的集合（按顺序）：**
```
user_profiles
industries
stages
question_banks
diagnosis_records
archive_tasks
guide_articles
favorites
unlock_records
feedbacks
```

### 批量导入初始数据

#### 3.1 industries 集合（5 条数据）
复制以下内容保存为 `industries.json`，然后导入：

```json
[
  {"_id": "1", "name": "餐饮", "tag": "选址 / 客流 / 回本", "sort": 1, "enabled": true},
  {"_id": "2", "name": "零售", "tag": "选品 / 库存 / 周转", "sort": 2, "enabled": true},
  {"_id": "3", "name": "美业", "tag": "技术 / 复购 / 口碑", "sort": 3, "enabled": true},
  {"_id": "4", "name": "轻服务业", "tag": "服务 / 体验 / 会员", "sort": 4, "enabled": true},
  {"_id": "5", "name": "通用开店", "tag": "普适性指导", "sort": 5, "enabled": true}
]
```

#### 3.2 stages 集合（4 条数据）
复制以下内容保存为 `stages.json`，然后导入：

```json
[
  {"_id": "prepare", "name": "准备开店", "desc": "还在考察项目，没开始投入。", "sort": 1, "enabled": true},
  {"_id": "preparing", "name": "正在筹备", "desc": "已投入资金，正在装修/招人/办证。", "sort": 2, "enabled": true},
  {"_id": "opened", "name": "已开业", "desc": "门店正常营业中。", "sort": 3, "enabled": true},
  {"_id": "second_store", "name": "想做二店", "desc": "已有门店，想扩张开分店。", "sort": 4, "enabled": true}
]
```

#### 3.3 question_banks 集合（示例 1 题）
先导入 1 题测试用：

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
    {"text": "非常明确，能说出具体画像", "score": 20},
    {"text": "基本清楚，有个大致方向", "score": 12},
    {"text": "还比较模糊，说不太准", "score": 4}
  ]
}
```

---

## ⏱️ Step 4: 上传云函数（1 分钟）

### 方式一：单个上传（推荐新手）
1. 在微信开发者工具左侧，展开 `functions` 目录
2. 右键点击 `login` 文件夹
3. 选择 **"上传并部署：云端安装依赖"**
4. 等待上传完成（状态变为 ✓）
5. 重复以上步骤，依次上传所有云函数

**需要上传的云函数（共 10 个）：**
```
✓ login
✓ getSelectionConfig
✓ getQuestionnaire
✓ saveDiagnosis
✓ getArchive
✓ toggleTask
✓ submitFeedback
✓ toggleFavorite（新增）
✓ updateSelection（新增）
✓ unlockPro（新增）
```

### 方式二：批量上传（老手）
在项目根目录执行：
```bash
# 如果有云开发 CLI 工具
cloudbase functions:deploy --env cloudbase-8geupl3d712dbad6
```

---

## ⏱️ Step 5: 设置数据库权限（30 秒）

1. 在云开发控制台 → 数据库
2. 依次点击每个集合 → "数据权限"
3. 按以下规则设置：

| 集合 | 权限设置 |
|------|---------|
| user_profiles | 仅创建者可读写 |
| industries | 所有人可读，仅管理员可写 |
| stages | 所有人可读，仅管理员可写 |
| question_banks | 所有人可读，仅管理员可写 |
| diagnosis_records | 仅创建者可读写 |
| archive_tasks | 仅创建者可读写 |
| guide_articles | 所有人可读，仅管理员可写 |
| favorites | 仅创建者可读写 |
| unlock_records | 创建者可读，管理员可写 |
| feedbacks | 创建者可写，管理员可读 |

---

## ⏱️ Step 6: 编译运行（30 秒）

1. 在微信开发者工具中，点击 **"编译"** 按钮
2. 如果能正常显示登录页，说明项目初始化成功！

---

## ✅ 验证清单

完成后应该能看到：

- [ ] 微信开发者工具左下角显示环境 ID：`cloudbase-8geupl3d712dbad6`
- [ ] 云开发控制台 → 数据库 中有 10 个集合
- [ ] `industries` 集合有 5 条行业数据
- [ ] `stages` 集合有 4 条阶段数据
- [ ] `question_banks` 集合至少有 1 道测试题目
- [ ] 云函数列表中 10 个云函数状态都是"已部署"（✓）
- [ ] 小程序编译后能显示登录页面

---

## 🐛 常见问题

### Q1: 提示"当前基础库不支持云开发"
**解决：** 
- 检查详情 → 本地设置 → "启用云开发"是否勾选
- 重启微信开发者工具

### Q2: 上传云函数失败
**解决：**
- 确认已登录微信开发者工具
- 检查网络是否正常
- 查看云函数目录下 `package.json` 是否存在
- 重新上传时选择"云端安装依赖"

### Q3: 数据库导入 JSON 失败
**解决：**
- 检查 JSON 格式是否正确（可用在线 JSON 校验工具）
- 确保文件中没有注释
- 尝试单条手动添加

### Q4: 编译后看不到登录页
**解决：**
- 清除缓存：工具 → 清除缓存 → 全部清除
- 重新编译
- 检查 `app.json` 中 `pages` 配置是否包含 `pages/auth/index`

---

## 🎉 下一步

完成初始化后，建议：

1. **详细阅读** [`DATABASE_SETUP.md`](./DATABASE_SETUP.md) 了解完整数据库设计
2. **查看** [`PROJECT_ANALYSIS.md`](./PROJECT_ANALYSIS.md) 了解项目全貌
3. **开始测试** 登录流程、行业选择、答题功能
4. **继续开发** 将 Mock 数据替换为云函数调用

---

## 📞 需要帮助？

如果遇到问题：
1. 查看微信开发者工具的错误日志
2. 查看云开发控制台的云函数日志
3. 参考 PRD 文档和产品说明

**祝你好运！🚀**
