'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Pricing() {
  const [user, setUser] = useState<any>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const plans = [
    {
      name: '免费版',
      description: '适合偶尔使用的用户',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        '每月 50 张图片处理',
        '标准质量输出',
        '基础背景去除',
        '7天历史记录保存',
        '支持 PNG/JPG 格式',
      ],
      notIncluded: [
        '批量处理',
        '高清 4K 输出',
        '优先处理队列',
        'API 访问',
      ],
      cta: '免费开始',
      popular: false,
    },
    {
      name: '专业版',
      description: '适合个人创作者',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        '每月 500 张图片处理',
        '高清 4K 输出',
        '优先处理队列',
        '批量处理 (最多 10 张)',
        '30天历史记录保存',
        '支持所有格式',
        '无水印输出',
      ],
      notIncluded: [
        'API 访问',
        '专属客服',
      ],
      cta: '立即升级',
      popular: true,
    },
    {
      name: '团队版',
      description: '适合小型团队',
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        '每月 2000 张图片处理',
        '超高清 4K+ 输出',
        '极速处理队列',
        '批量处理 (最多 50 张)',
        '90天历史记录保存',
        'API 访问',
        '3 个团队成员',
        '专属客服支持',
      ],
      notIncluded: [],
      cta: '联系销售',
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            🌀 背景移除工具
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-800">
              首页
            </Link>
            <Link href="/pricing" className="text-blue-600 font-medium">
              定价
            </Link>
            <Link href="/faq" className="text-gray-600 hover:text-gray-800">
              FAQ
            </Link>
            {user ? (
              <Link 
                href="/dashboard"
                className="flex items-center gap-2"
              >
                <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
              </Link>
            ) : (
              <Link 
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                登录
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            简单透明的定价
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            选择适合你的方案，随时升级或降级
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`${billingCycle === 'monthly' ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
              月付
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-14 h-8 bg-blue-600 rounded-full transition-colors"
            >
              <span
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`${billingCycle === 'yearly' ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
              年付
            </span>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
              省 17%
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                plan.popular ? 'ring-4 ring-blue-500 transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-blue-500 text-white text-center py-2 text-sm font-medium">
                  最受欢迎
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <p className="text-gray-500 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-800">
                    ¥{billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  <span className="text-gray-500">/{billingCycle === 'monthly' ? '月' : '年'}</span>
                  {billingCycle === 'yearly' && plan.yearlyPrice > 0 && (
                    <p className="text-sm text-gray-400 mt-1">
                      相当于 ¥{Math.round(plan.yearlyPrice / 12)}/月
                    </p>
                  )}
                </div>

                <Link
                  href={user ? '/dashboard' : '/'}
                  className={`block w-full text-center py-3 rounded-lg font-medium transition-colors mb-8 ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  {plan.cta}
                </Link>

                <div className="space-y-4">
                  <p className="font-medium text-gray-800">包含功能：</p>
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.notIncluded.length > 0 && (
                    <>
                      <p className="font-medium text-gray-800 mt-6">不包含：</p>
                      {plan.notIncluded.map((feature) => (
                        <div key={feature} className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gray-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-400">{feature}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">功能对比</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4">功能</th>
                  <th className="text-center py-4 px-4">免费版</th>
                  <th className="text-center py-4 px-4 bg-blue-50">专业版</th>
                  <th className="text-center py-4 px-4">团队版</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: '每月处理额度', free: '50 张', pro: '500 张', team: '2000 张' },
                  { feature: '输出质量', free: '标准', pro: '高清 4K', team: '超高清 4K+' },
                  { feature: '批量处理', free: '❌', pro: '10 张/次', team: '50 张/次' },
                  { feature: '处理速度', free: '标准队列', pro: '优先队列', team: '极速队列' },
                  { feature: '历史记录保存', free: '7 天', pro: '30 天', team: '90 天' },
                  { feature: '水印', free: '有水印', pro: '无水印', team: '无水印' },
                  { feature: 'API 访问', free: '❌', pro: '❌', team: '✅' },
                  { feature: '团队成员', free: '1 人', pro: '1 人', team: '3 人' },
                  { feature: '客服支持', free: '社区支持', pro: '邮件支持', team: '专属客服' },
                ].map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-4 px-4 font-medium">{row.feature}</td>
                    <td className="text-center py-4 px-4">{row.free}</td>
                    <td className="text-center py-4 px-4 bg-blue-50 font-medium text-blue-700">{row.pro}</td>
                    <td className="text-center py-4 px-4">{row.team}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Preview */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">还有疑问？</h2>
          <p className="text-gray-600 mb-6">查看我们的常见问题解答</p>
          <Link
            href="/faq"
            className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            查看 FAQ
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">© 2026 背景移除工具. 保留所有权利.</p>
        </div>
      </footer>
    </div>
  )
}
