# 德州扑克 GTO 策略练习器

一个用于练习接近 GTO (Game Theory Optimal) 决策的 Web 应用，使用 React + TypeScript 构建。

## 功能特性

- **深色主题界面**：纯黑背景设计，视觉舒适
- **白色扑克牌**：清晰的卡牌显示，花色颜色区分（红桃/方块为红色，黑桃/梅花为黑色）
- **GTO 策略建议**：基于简化的 GTO 数据库，提供每个决策点的频率分布
- **即时反馈**：每次决策后立即获得评分和反馈
- **练习统计**：跟踪总题数、平均分和最近 5 手平均分

## 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **CSS** - 样式（无需额外的 UI 库）

## 项目结构

```
gto-trainer/
├── src/
│   ├── App.tsx           # 主应用组件
│   ├── Card.tsx          # 扑克牌组件
│   ├── Table.tsx         # 牌桌组件（显示公共牌和手牌）
│   ├── Controls.tsx      # 操作按钮组件
│   ├── InfoPanel.tsx     # 信息和反馈面板
│   ├── gtoData.ts        # GTO 策略数据库
│   ├── gtoEngine.ts      # GTO 策略评估引擎
│   ├── gameUtils.ts      # 游戏工具函数（发牌、随机生成等）
│   ├── App.css           # 主样式文件
│   ├── index.css         # 全局样式
│   └── main.tsx          # 应用入口
├── index.html            # HTML 模板
├── package.json          # 依赖配置
├── tsconfig.json         # TypeScript 配置
└── vite.config.ts        # Vite 配置
```

## 安装与运行

### 安装依赖

```bash
cd gto-trainer
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动。

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

### 预览生产版本

```bash
npm run preview
```

## 使用说明

1. **开始练习**：页面加载后自动生成第一手牌
2. **查看信息**：
   - 左侧：公共牌和你的手牌
   - 右侧：当前局面信息、GTO 策略建议和统计数据
3. **做出决策**：点击底部的操作按钮（弃牌/跟注/加注等）
4. **查看反馈**：做出决策后，右侧面板会显示：
   - 你的决策得分（0-100）
   - 文字反馈说明
   - 是否为最优决策
5. **继续练习**：点击「下一手」按钮生成新的局面

## 架构设计

### 数据流

1. **局面生成**：`gameUtils.ts` 负责随机生成手牌和公共牌
2. **策略查询**：`gtoEngine.ts` 根据手牌类型查询 `gtoData.ts` 中的策略
3. **决策评估**：玩家做出决策后，`gtoEngine.ts` 计算得分和反馈
4. **状态管理**：`App.tsx` 使用 React Hooks 管理游戏状态和统计数据

### 组件职责

- **App.tsx**：顶层组件，管理游戏状态和统计数据
- **Table.tsx**：显示公共牌和玩家手牌
- **Card.tsx**：渲染单张扑克牌（白色背景，花色颜色区分）
- **Controls.tsx**：提供操作按钮（Fold/Call/Raise 等）
- **InfoPanel.tsx**：显示局面信息、GTO 建议和反馈

### GTO 数据结构

策略数据采用简化的频率分布模型：

```typescript
{
  scenario: "HU_BTN_vs_BB",      // 场景（BTN vs BB 单挑）
  street: "preflop",              // 街次
  handCategory: "premium",        // 手牌类型
  strategy: {
    fold: 0,                      // 弃牌频率
    call: 0,                      // 跟注频率
    raise_1_3: 0.3,               // 加注 1/3 底池频率
    raise_1_2: 0.5,               // 加注 1/2 底池频率
    raise_2_3: 0.2,               // 加注 2/3 底池频率
    all_in: 0                     // 全下频率
  }
}
```

## 未来扩展

当前版本是一个功能原型，可以考虑以下扩展：

- 添加更多场景（多人底池、不同位置）
- 实现更复杂的翻后策略（基于牌面纹理）
- 添加更详细的手牌范围分析
- 支持自定义训练场景
- 添加历史记录和回放功能
- 集成真实的 GTO 求解器数据

## 许可证

MIT
