import { D1Database } from '@cloudflare/workers-types';

// 获取数据库实例（从 Cloudflare 绑定）
export function getDB(): D1Database {
  // @ts-ignore - 运行时由 Cloudflare 注入
  return globalThis.DB;
}

// 初始化数据库表（自动创建）
export async function initDB() {
  const db = getDB();
  if (!db) return;

  try {
    // 创建用户表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        paypal_email TEXT,
        credits INTEGER DEFAULT 0,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
      )
    `);

    // 创建订单表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        paypal_order_id TEXT UNIQUE,
        amount REAL,
        currency TEXT,
        credits INTEGER,
        status TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // 创建积分使用记录表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS credit_usage (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        credits_used INTEGER,
        description TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // 创建索引
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_orders_paypal ON orders(paypal_order_id)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_usage_user ON credit_usage(user_id)`);

    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

// 获取或创建用户
export async function getUserByEmail(email: string) {
  const db = getDB();
  const result = await db
    .prepare('SELECT * FROM users WHERE email = ?')
    .bind(email)
    .first();
  return result;
}

// 创建用户
export async function createUser(email: string, paypalEmail: string) {
  const db = getDB();
  const id = crypto.randomUUID();
  await db
    .prepare('INSERT INTO users (id, email, paypal_email, credits) VALUES (?, ?, ?, 0)')
    .bind(id, email, paypalEmail)
    .run();
  return { id, email, paypal_email: paypalEmail, credits: 0 };
}

// 添加积分
export async function addCredits(userId: string, credits: number) {
  const db = getDB();
  await db
    .prepare('UPDATE users SET credits = credits + ?, updated_at = strftime(\'%s\', \'now\') WHERE id = ?')
    .bind(credits, userId)
    .run();
}

// 扣减积分
export async function useCredits(userId: string, credits: number, description: string) {
  const db = getDB();
  const usageId = crypto.randomUUID();
  
  // 检查积分是否足够
  const user = await db
    .prepare('SELECT credits FROM users WHERE id = ?')
    .bind(userId)
    .first();
  
  if (!user || user.credits < credits) {
    throw new Error('Insufficient credits');
  }
  
  // 扣减积分
  await db
    .prepare('UPDATE users SET credits = credits - ?, updated_at = strftime(\'%s\', \'now\') WHERE id = ?')
    .bind(credits, userId)
    .run();
  
  // 记录使用
  await db
    .prepare('INSERT INTO credit_usage (id, user_id, credits_used, description) VALUES (?, ?, ?, ?)')
    .bind(usageId, userId, credits, description)
    .run();
  
  return { success: true, remaining: user.credits - credits };
}

// 获取用户积分
export async function getUserCredits(userId: string) {
  const db = getDB();
  const result = await db
    .prepare('SELECT credits FROM users WHERE id = ?')
    .bind(userId)
    .first();
  return result?.credits || 0;
}

// 记录订单
export async function createOrder(order: {
  id: string;
  user_id: string;
  paypal_order_id: string;
  amount: number;
  currency: string;
  credits: number;
  status: string;
}) {
  const db = getDB();
  await db
    .prepare('INSERT INTO orders (id, user_id, paypal_order_id, amount, currency, credits, status) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(order.id, order.user_id, order.paypal_order_id, order.amount, order.currency, order.credits, order.status)
    .run();
}

// 更新订单状态
export async function updateOrderStatus(paypalOrderId: string, status: string) {
  const db = getDB();
  await db
    .prepare('UPDATE orders SET status = ? WHERE paypal_order_id = ?')
    .bind(status, paypalOrderId)
    .run();
}
