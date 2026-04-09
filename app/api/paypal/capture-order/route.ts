import { NextRequest, NextResponse } from 'next/server';
import { addCredits, createOrder, getUserByEmail, createUser } from '../../../utils/db';

// 套餐配置
const PACKAGES: Record<string, { credits: number; price: string }> = {
  '4.99': { credits: 10, price: '4.99' },
  '12.99': { credits: 30, price: '12.99' },
  '29.99': { credits: 80, price: '29.99' },
  '7.99': { credits: 30, price: '7.99' },
  '15.99': { credits: 80, price: '15.99' },
};

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { orderId, payerEmail } = await request.json();

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_SECRET;

    if (!clientId || !secret) {
      return NextResponse.json(
        { error: 'PayPal credentials not configured' },
        { status: 500 }
      );
    }

    // 判断是否为沙箱环境
    const isSandbox = clientId.startsWith('Ae') || clientId.length < 50;
    const baseUrl = isSandbox 
      ? 'https://api-m.sandbox.paypal.com' 
      : 'https://api-m.paypal.com';

    // 获取访问令牌
    const tokenResponse = await fetch(
      `${baseUrl}/v1/oauth2/token`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'en_US',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(`${clientId}:${secret}`).toString('base64'),
        },
        body: 'grant_type=client_credentials',
      }
    );

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      throw new Error('Failed to get PayPal access token');
    }

    // 获取订单详情
    const orderResponse = await fetch(
      `${baseUrl}/v2/checkout/orders/${orderId}`,
      {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const orderData = await orderResponse.json();

    if (orderData.status !== 'COMPLETED' && orderData.status !== 'APPROVED') {
      throw new Error('Payment not completed');
    }

    // 获取支付金额
    const amount = orderData.purchase_units?.[0]?.amount?.value || '0';
    const currency = orderData.purchase_units?.[0]?.amount?.currency_code || 'USD';
    const payerPaypalEmail = orderData.payer?.email_address || payerEmail || '';

    // 获取对应的积分
    const packageInfo = PACKAGES[amount] || { credits: 0, price: amount };

    // 获取或创建用户
    let user = await getUserByEmail(payerPaypalEmail);
    if (!user) {
      user = await createUser(payerPaypalEmail, payerPaypalEmail);
    }

    // 添加积分
    await addCredits(user.id, packageInfo.credits);

    // 记录订单
    await createOrder({
      id: crypto.randomUUID(),
      user_id: user.id,
      paypal_order_id: orderId,
      amount: parseFloat(amount),
      currency,
      credits: packageInfo.credits,
      status: orderData.status,
    });

    // 获取更新后的积分
    const newCredits = await getUserCredits(user.id);

    return NextResponse.json({
      success: true,
      status: orderData.status,
      credits: packageInfo.credits,
      totalCredits: newCredits,
      transactionId: orderData.purchase_units?.[0]?.payments?.captures?.[0]?.id,
    });
  } catch (error) {
    console.error('PayPal capture-order error:', error);
    return NextResponse.json(
      { error: 'Failed to capture order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// 获取用户积分
async function getUserCredits(userId: string): Promise<number> {
  try {
    const db = (globalThis as any).DB;
    if (!db) return 0;
    
    const result = await db
      .prepare('SELECT credits FROM users WHERE id = ?')
      .bind(userId)
      .first();
    return result?.credits || 0;
  } catch {
    return 0;
  }
}
