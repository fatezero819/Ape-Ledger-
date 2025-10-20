# Ape Ledger 项目大纲

## 文件结构

### 核心页面文件
1. **index.html** - 数据看板主页
   - 顶部导航栏（应用标题 + 新增项目 + 管理钱包）
   - 数据总览卡片（项目数、总成本、总收入、总盈亏）
   - 筛选器（项目类型、状态）
   - 项目卡片网格展示
   - 饼图数据可视化

2. **project.html** - 项目管理页面
   - 新增/编辑项目表单
   - 项目名称、类型、状态选择
   - 钱包选择下拉菜单
   - 成本、收入输入，自动计算盈亏
   - 保存/取消/删除操作

3. **wallet.html** - 钱包管理页面
   - 钱包列表展示
   - 添加新钱包表单
   - 编辑/删除钱包功能
   - 地址格式验证

### 资源文件
4. **main.js** - 主要JavaScript逻辑
   - 数据存储管理（localStorage）
   - 页面间导航逻辑
   - 表单验证和提交
   - 数据计算和统计
   - 动画效果控制

5. **resources/** - 资源文件夹
   - 应用图标 (app-icon.png)
   - 背景图片 (background.jpg)
   - 项目类型图标

## 功能模块划分

### 数据管理模块
- localStorage数据存储
- 数据结构定义（项目、钱包）
- 数据CRUD操作
- 数据导入导出

### 页面渲染模块
- 动态生成项目卡片
- 筛选和排序功能
- 数据可视化图表
- 响应式布局

### 交互逻辑模块
- 表单验证
- 页面跳转
- 动画效果
- 用户反馈

### 工具函数模块
- 地址格式化
- 数字格式化
- 日期处理
- 网络类型识别

## 数据结构设计

### 项目数据
```javascript
{
  id: "unique_id",
  name: "项目名称",
  type: "测试网|主网|节点|DeFi|NFT|其他",
  status: "进行中|已完成|放弃",
  walletId: "wallet_id",
  cost: 0,
  income: 0,
  profit: 0,
  notes: "备注",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### 钱包数据
```javascript
{
  id: "unique_id",
  alias: "钱包别名",
  address: "钱包地址",
  network: "网络类型",
  createdAt: "timestamp"
}
```

## 页面间导航流程

1. **index.html → project.html**
   - 点击"新增项目"按钮
   - 点击项目卡片（编辑模式）

2. **index.html → wallet.html**
   - 点击"管理钱包"按钮

3. **project.html → index.html**
   - 保存成功后返回
   - 点击取消按钮返回

4. **wallet.html → index.html**
   - 点击返回按钮

## 技术栈

- **前端框架**：原生HTML/CSS/JavaScript
- **样式框架**：Tailwind CSS
- **动画库**：Anime.js
- **图表库**：ECharts.js
- **字体**：Noto Sans SC, Noto Serif SC
- **数据存储**：localStorage
- **响应式设计**：CSS Grid + Flexbox