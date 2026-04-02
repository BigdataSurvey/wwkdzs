# 稳稳开店助手 · 云开发骨架说明

## 已确认的首版约束
- 云开发环境 ID：`cloudbase-8geupl3d712dbad6`
- 必须微信授权登录
- 直接使用微信云数据库
- 需要云函数
- 需要保存：诊断记录 / 收藏 / 复测 / 深度诊断解锁状态
- AI 首版不接真实接口，只预留入口

## 建议集合设计

### 1. `user_profiles`
用户基础档案。
```json
{
  "_id": "openid",
  "nickName": "微信昵称",
  "avatarUrl": "头像",
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

### 2. `industries`
行业配置，由你在后台维护。
```json
{
  "_id": "1",
  "name": "餐饮",
  "tag": "选址 / 客流 / 回本",
  "sort": 1,
  "enabled": true
}
```

### 3. `stages`
阶段配置。
```json
{
  "_id": "prepare",
  "name": "筹备期",
  "desc": "还没开业，先判断值不值得投。",
  "sort": 1,
  "enabled": true
}
```

### 4. `question_banks`
题库集合。首版只需要 `type=base`。
```json
{
  "_id": "base_canyin_prepare_q1",
  "industryId": 1,
  "stageKey": "prepare",
  "type": "base",
  "title": "你是否明确目标用户？",
  "desc": "至少能描述画像和触达路径。",
  "sort": 1,
  "enabled": true,
  "options": [
    { "text": "非常明确", "score": 20 },
    { "text": "基本清楚", "score": 12 },
    { "text": "还比较模糊", "score": 4 }
  ]
}
```

### 5. `diagnosis_records`
用户诊断记录。
```json
{
  "_id": "auto",
  "openid": "用户 openid",
  "industryId": 1,
  "industryName": "餐饮",
  "stageKey": "prepare",
  "stageName": "筹备期",
  "type": "base",
  "score": 68,
  "level": "优先优化",
  "summary": "可以继续做，但先补齐关键短板。",
  "answers": [0,1,2,0,1],
  "createdAt": "Date"
}
```

### 6. `archive_tasks`
经营档案中的待执行动作。
```json
{
  "_id": "auto",
  "openid": "用户 openid",
  "text": "先压测 3 个月现金流安全线",
  "done": false,
  "source": "diagnosis_result",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 7. `guide_articles`
避坑指南图文内容。
```json
{
  "_id": "auto",
  "industryId": 1,
  "stageKey": "prepare",
  "title": "开店前先别急着签租约",
  "summary": "先把现金流和退出条件写出来。",
  "content": "图文正文",
  "cover": "",
  "tags": ["租约", "现金流"],
  "favoritedCount": 0,
  "enabled": true,
  "updatedAt": "Date"
}
```

### 8. `favorites`
收藏关系表。
```json
{
  "_id": "auto",
  "openid": "用户 openid",
  "targetType": "guide",
  "targetId": "guide_article_id",
  "createdAt": "Date"
}
```

### 9. `unlock_records`
深度诊断解锁记录，给下一版预留。
```json
{
  "_id": "auto",
  "openid": "用户 openid",
  "unlockType": "pro_assessment",
  "source": "rewarded_ad",
  "createdAt": "Date"
}
```

### 10. `feedbacks`
用户反馈。
```json
{
  "_id": "auto",
  "openid": "用户 openid",
  "category": "UI建议",
  "content": "反馈内容",
  "status": "new",
  "createdAt": "Date"
}
```

## 建议首批云函数
- `login`: 获取 openid 并初始化用户档案
- `getSelectionConfig`: 拉取行业、阶段配置
- `getQuestionnaire`: 拉取题库
- `saveDiagnosis`: 保存诊断结果并生成待执行动作
- `getArchive`: 拉取经营档案页数据
- `toggleTask`: 更新待执行动作状态
- `submitFeedback`: 提交反馈
- `toggleFavorite`: 收藏或取消收藏

## 首版埋点建议
- 首页曝光
- 首页点击基础诊断
- 行业阶段设置完成
- 基础诊断开始
- 基础诊断完成
- 结果页点击利润测算
- 档案页待执行动作点击
