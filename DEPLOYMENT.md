# 部署清单

## ✅ 已完成（代码部分）

- [x] 数据库 Schema 设计 (`sql/schema.sql`)
- [x] 数据库工具函数 (`lib/db.ts`)
- [x] 支付成功自动添加积分 (`app/api/paypal/capture-order/route.ts`)
- [x] Webhook 处理器 (`app/api/paypal/webhook/route.ts`)
- [x] 用户积分查询 API (`app/api/user/credits/route.ts`)
- [x] 前端支付成功提示优化 (`app/pricing/page.tsx`)
- [x] Wrangler 配置 (`wrangler.toml`)

---

## 🔧 需要手动操作（Cloudflare Dashboard）

### 1. 创建 D1 数据库

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 左侧 → **D1** → **Create a database**
3. 名称：`bg-remover-db`
4. 点击 **Create**

### 2. 执行数据库迁移

1. 进入刚创建的数据库
2. 点击 **Console** 标签
3. 复制 `sql/schema.sql` 的内容
4. 粘贴到控制台并执行

### 3. 绑定数据库到 Pages

1. 进入 **Workers & Pages** → **image-background-remover**（或 `bg-remover-paypal`）
2. 点击 **设置 (Settings)** → **函数 (Functions)**
3. 找到 **D1 数据库绑定**
4. 点击 **添加绑定**
   - **变量名**: `DB`
   - **数据库**: 选择 `bg-remover-db`
5. 点击 **保存**

### 4. 重新部署

1. 点击 **部署 (Deployments)**
2. 点击 **重新部署 (Redeploy)**
3. 等待完成

---

## 🔧 需要手动操作（PayPal Developer Dashboard）

### 配置 Webhook

1. 登录 [PayPal Developer Dashboard](https://developer.paypal.com/)
2. **Apps & Credentials** → **Sandbox** → 选择你的应用
3. 点击 **Webhooks** → **Add Webhook**
4. 填写：
   - **Webhook URL**: `https://bg-remover-paypal.pages.dev/api/paypal/webhook`
   - **Event types**: 勾选以下事件
     - ✅ `PAYMENT.CAPTURE.COMPLETED`
     - ✅ `PAYMENT.CAPTURE.DENIED`
     - ✅ `CHECKOUT.ORDER.APPROVED`
5. 点击 **Save**

---

## 🧪 测试流程

1. 打开网站：https://bg-remover-paypal.pages.dev
2. 上传一张图片
3. 点击购买积分
4. 用沙箱买家账号付款
5. 支付成功后应该显示：
   - ✅ 支付成功提示
   - ✅ 获得的积分数量
   - ✅ 当前总积分

---

## 📊 数据库查询（可选）

在 Cloudflare D1 Console 中查询：

```sql
-- 查看所有用户
SELECT * FROM users;

-- 查看所有订单
SELECT * FROM orders;

-- 查看某个用户的积分
SELECT credits FROM users WHERE email = 'sb-xxxxx@personal.example.com';
```

---

## 🚀 下一步

完成上述手动操作后，系统就完整了！

然后再考虑：
- 自定义域名配置
- 切换到正式环境（Live PayPal）
- 添加用户登录系统
