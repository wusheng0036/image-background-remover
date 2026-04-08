'use client';

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useState } from 'react';

const PACKAGES = {
  // Credit Packs
  starter: { id: 'starter', credits: 10, price: '4.99', type: 'one-time' },
  popular: { id: 'popular', credits: 30, price: '12.99', type: 'one-time' },
  pro: { id: 'pro', credits: 80, price: '29.99', type: 'one-time' },
  // Subscriptions
  basic: { id: 'basic', credits: 30, price: '7.99', type: 'subscription' },
  proSub: { id: 'pro-sub', credits: 80, price: '15.99', type: 'subscription' },
};

export default function PricingPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const handleApprove = async (packageId: string, orderId: string) => {
    try {
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      const result = await response.json();

      if (result.success) {
        // TODO: 支付成功后处理
        // - 更新用户积分
        // - 跳转成功页面或显示成功提示
        alert(`支付成功！${PACKAGES[packageId as keyof typeof PACKAGES].credits} 积分已添加到您的账户。`);
        setSelectedPackage(null);
      } else {
        alert('支付处理失败，请联系客服');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('支付失败，请重试');
    }
  };

  const PayPalButton = ({ packageId }: { packageId: string }) => {
    const pkg = PACKAGES[packageId as keyof typeof PACKAGES];
    
    return (
      <PayPalButtons
        style={{ layout: 'vertical' }}
        createOrder={async () => {
          const response = await fetch('/api/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: pkg.price,
              currency: 'USD',
              description: `${pkg.credits} credits - ${pkg.type === 'subscription' ? 'Monthly Subscription' : 'One-time Purchase'}`,
            }),
          });
          const data = await response.json();
          return data.orderId;
        }}
        onApprove={async (data: any) => {
          await handleApprove(packageId, data.orderID);
        }}
        onError={() => {
          alert('支付出错，请重试');
        }}
      />
    );
  };

  return (
    <PayPalScriptProvider options={{ 
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'AZ1p5M9Y9yMmqcIn8U4jgFDHyRM9wR_jFb7VAx0yFhp8FAuuQmifwhj7CRIpVPkD6pBtWhAS5ByN9kjk',
      currency: 'USD',
      intent: 'capture',
    }}>
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Hero */}
          <section className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Simple, flexible pricing
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Start free, then choose what works for you. Credits never expire.
            </p>
            <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 px-6 py-3 rounded-full">
              <span>🎉</span>
              <span className="text-green-400 font-bold">3 free images</span>
              <span className="text-gray-400">to get started — no credit card required</span>
            </div>
          </section>

          {/* Credit Packs */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Credit Packs</h2>
            <p className="text-gray-400">One-time purchase. Use anytime. Perfect for occasional use.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {/* Starter - $4.99 */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 hover:border-indigo-500 transition-all hover:-translate-y-1">
              <div className="text-5xl font-bold mb-1">10 <span className="text-xl">credits</span></div>
              <div className="text-3xl font-bold mb-1">$4.99</div>
              <div className="text-gray-400 mb-6">$0.50 per image</div>
              {selectedPackage === 'starter' ? (
                <PayPalButton packageId="starter" />
              ) : (
                <button 
                  onClick={() => setSelectedPackage('starter')}
                  className="w-full py-3 px-6 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-all"
                >
                  Buy Starter Pack
                </button>
              )}
            </div>

            {/* Popular - $12.99 */}
            <div className="bg-slate-800 border-2 border-indigo-500 rounded-2xl p-8 relative hover:-translate-y-1 transition-all">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                ⭐ Most Popular
              </div>
              <div className="text-5xl font-bold mb-1">30 <span className="text-xl">credits</span></div>
              <div className="text-3xl font-bold mb-1">$12.99</div>
              <div className="text-gray-400 mb-6">$0.43 per image</div>
              {selectedPackage === 'popular' ? (
                <PayPalButton packageId="popular" />
              ) : (
                <button 
                  onClick={() => setSelectedPackage('popular')}
                  className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 rounded-lg font-semibold transition-all"
                >
                  Buy Popular Pack
                </button>
              )}
            </div>

            {/* Pro Pack - $29.99 */}
            <div className="bg-slate-800 border-2 border-green-500 rounded-2xl p-8 relative hover:-translate-y-1 transition-all">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-slate-900 text-sm font-bold px-4 py-1 rounded-full">
                Best Value
              </div>
              <div className="text-5xl font-bold mb-1">80 <span className="text-xl">credits</span></div>
              <div className="text-3xl font-bold mb-1">$29.99</div>
              <div className="text-gray-400 mb-6">$0.37 per image</div>
              {selectedPackage === 'pro' ? (
                <PayPalButton packageId="pro" />
              ) : (
                <button 
                  onClick={() => setSelectedPackage('pro')}
                  className="w-full py-3 px-6 bg-green-500 hover:bg-green-400 text-slate-900 rounded-lg font-semibold transition-all"
                >
                  Buy Pro Pack
                </button>
              )}
            </div>
          </div>

          {/* Subscriptions */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Monthly Subscriptions</h2>
            <p className="text-gray-400">Best value for regular users. Credits refresh monthly.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Basic - $7.99 */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 hover:border-green-500 transition-all">
              <div className="inline-block bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full mb-4">
                Save vs Packs
              </div>
              <div className="text-2xl font-bold mb-2">Basic</div>
              <div className="text-4xl font-bold text-green-400 mb-1">30 <span className="text-base text-gray-400">credits/month</span></div>
              <div className="text-2xl font-bold mb-1">$7.99/month</div>
              <div className="text-green-400 font-semibold mb-6">$0.27 per image</div>
              <ul className="space-y-3 mb-6 text-gray-400 text-sm">
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Credits refresh monthly</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Cancel anytime</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Unused credits roll over*</li>
              </ul>
              {selectedPackage === 'basic' ? (
                <PayPalButton packageId="basic" />
              ) : (
                <button 
                  onClick={() => setSelectedPackage('basic')}
                  className="w-full py-3 px-6 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-all"
                >
                  Subscribe Basic
                </button>
              )}
            </div>

            {/* Pro - $15.99 */}
            <div className="bg-slate-800 border-2 border-green-500 rounded-2xl p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-slate-900 text-sm font-bold px-4 py-1 rounded-full">
                Best Value
              </div>
              <div className="text-2xl font-bold mb-2">Pro</div>
              <div className="text-4xl font-bold text-green-400 mb-1">80 <span className="text-base text-gray-400">credits/month</span></div>
              <div className="text-2xl font-bold mb-1">$15.99/month</div>
              <div className="text-green-400 font-semibold mb-6">$0.20 per image</div>
              <ul className="space-y-3 mb-6 text-gray-400 text-sm">
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Credits refresh monthly</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Cancel anytime</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Unused credits roll over*</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Priority processing</li>
              </ul>
              {selectedPackage === 'pro-sub' ? (
                <PayPalButton packageId="pro-sub" />
              ) : (
                <button 
                  onClick={() => setSelectedPackage('pro-sub')}
                  className="w-full py-3 px-6 bg-green-500 hover:bg-green-400 text-slate-900 rounded-lg font-semibold transition-all"
                >
                  Subscribe Pro
                </button>
              )}
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-gray-500 text-sm mt-12">
            * Unused subscription credits roll over for up to 3 months. All prices in USD.
          </p>
        </div>
      </main>
    </PayPalScriptProvider>
  );
}
