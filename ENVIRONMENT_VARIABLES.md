# Cloudflare Pages 环境变量配置

## 必须配置的环境变量

在 Cloudflare Dashboard → Workers & Pages → bg-remover-v2 → Settings → Environment Variables → Add Variable

### 生产环境 (Production)

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | `Ae316YOk6i3rlT2YrFNBbjoLcMCC3j9uJYJqohQSYA9ObqZqoxpdtDIP2IWbnZMo9g0HD278u7LmJKdU` | PayPal 沙箱 Client ID（前端使用） |
| `PAYPAL_CLIENT_ID` | `Ae316YOk6i3rlT2YrFNBbjoLcMCC3j9uJYJqohQSYA9ObqZqoxpdtDIP2IWbnZMo9g0HD278u7LmJKdU` | PayPal 沙箱 Client ID（后端使用） |
| `PAYPAL_SECRET` | `EB4qwa7WUtOBlk85O6qMeUJuAdjuemmU7TD8Pq8l9HnCuFdGSKpOCCsCGACWSs2a0DR_nk8lYbS-pWtY` | PayPal 沙箱 Secret |
| `REMOVE_BG_API_KEY` | `QqhFaNyAce2QwYzm7m82MUyR` | Remove.bg API Key |

---

## 配置步骤

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → **bg-remover-v2**
3. 点击 **Settings** → **Environment Variables**
4. 点击 **Add Variable**
5. 逐个添加上述 4 个变量
6. 每个变量选择 **Production** 环境
7. 点击 **Save**
8. 返回 **Deployments** → **Retry deployment**

---

## 验证配置

部署完成后，访问网站测试 PayPal 支付按钮是否正常显示。
