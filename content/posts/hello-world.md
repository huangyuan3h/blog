---
title: "Hello Karios — 为什么做这个博客"
date: "2026-08-26"
summary: "从 S-3 三窗到多资产单轨，记录每一次可复现的证伪。"
tags: ["回测", "S-3", "多资产"]
cover: ""
---

> 这是第一篇演示：支持 **图片**、**表格**、**代码块**，部署于 Cloudflare Pages 免费栈。

## 为什么开这个站

- 把 `docs/backtests/*.md` 的验证过程公开
- 每篇都可复现：`LOOKBACK 60/MA200` `S-3 65/RS50`

### 回测表格示例（GFM）

| 策略 | 窗口 | 收益 | 胜率 |
|------|------|------|------|
| S-3 mp10 | OOS2 | +43.1% | 93 笔 |
| 单轨 OIL | 过去年 | +39.82% | HOLD |
| 窄箱突破 | 20日 | +4.10% vs +1.79% | win52% |

### 图片示例

![示例图](https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800)

### 代码

```python
# 窄箱突破验证
box_high = df.high.rolling(60).max().shift(1)
break_up = df.close > box_high
```

美观由 `Tailwind typography` 保障，`prose` 自动处理表格与图片圆角。
