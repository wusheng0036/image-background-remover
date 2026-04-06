'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function FAQ() {
  const [user, setUser] = useState<any>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const faqs = [
    {
      category: '通用问题',
      questions: [
        {
          q: '什么是背景移除工具？',
          a: '背景移除工具是一款基于 AI 技术的在线工具，可以自动识别图片中的主体并去除背景。我们使用先进的机器学习算法，能够在几秒钟内完成高质量的背景移除，无需任何设计技能。',
        },
        {
          q: '未登录用户可以使用吗？',
          a: '可以！未登录用户每月可以免费处理 50 张图片。但处理历史不会被保存，且输出图片会带有水印。建议登录以享受更好的体验。',
        },
        {
          q: '支持哪些图片格式？',
          a: '我们支持常见的图片格式，包括 PNG、JPG、JPEG 和 WebP。免费版支持最大 5MB 的图片，付费版支持最大 20MB 的图片。',
        },
        {
          q: '处理后的图片质量如何？',
          a: '免费版提供标准质量输出（适合网页使用），专业版和团队版提供高清 4K 输出（适合印刷和专业设计）。我们的 AI 能够精确识别边缘，包括头发、毛发等复杂细节。',
        },
      ],
    },
    {
      category: '定价与付费',
      questions: [
        {
          q: '免费版有什么限制？',
          a: '免费版每月可处理 50 张图片，输出为标准质量，带水印，历史记录仅保存 7 天。适合偶尔使用的用户或想要先体验功能的用户。',
        },
        {
          q: '如何选择合适的方案？',
          a: '如果你只是偶尔使用，免费版就足够了。如果你是内容创作者、电商卖家或设计师，需要处理大量图片，专业版（¥29/月）是最佳选择。如果你是团队或企业，团队版（¥99/月）提供 API 访问和多人协作功能。',
        },
        {
          q: '可以随时升级或降级吗？',
          a: '当然可以！你可以随时升级或降级你的方案。升级后立即生效，降级在当前计费周期结束后生效。我们也提供 7 天无理由退款保证。',
        },
        {
          q: '支持哪些支付方式？',
          a: '我们支持支付宝、微信支付和信用卡支付。所有支付都通过安全的第三方支付网关处理，我们不会保存你的支付信息。',
        },
        {
          q: '有年付优惠吗？',
          a: '有的！选择年付可以享受 17% 的折扣。例如专业版年付仅需 ¥290（相当于 ¥24/月），比月付节省 ¥58。',
        },
      ],
    },
    {
      category: '使用帮助',
      questions: [
        {
          q: '如何获得最佳的处理效果？',
          a: '为了获得最佳效果，建议使用主体清晰、背景相对简单的图片。避免使用主体与背景颜色相近的图片。专业版和团队版提供手动调整功能，可以进一步优化结果。',
        },
        {
          q: '批量处理如何使用？',
          a: '专业版支持最多 10 张图片同时批量处理，团队版支持最多 50 张。只需在选择图片时按住 Ctrl（Windows）或 Cmd（Mac）键选择多张图片即可。',
        },
        {
          q: '处理后的图片会保存多久？',
          a: '免费版保存 7 天，专业版保存 30 天，团队版保存 90 天。建议及时处理完成后下载保存到本地。你也可以随时删除历史记录中的图片。',
        },
        {
          q: 'API 如何使用？',
          a: 'API 功能仅对团队版用户开放。购买团队版后，你可以在个人中心的设置页面获取 API 密钥。我们提供完整的 API 文档和代码示例，支持各种编程语言。',
        },
      ],
    },
    {
      category: '账户与隐私',
      questions: [
        {
          q: '我的图片数据安全吗？',
          a: '绝对安全！我们使用银行级别的加密技术保护你的数据。处理完成后，原始图片会立即从服务器删除，仅保留处理后的结果。我们绝不会将你的图片用于任何其他目的或与第三方分享。',
        },
        {
          q: '如何删除我的账户？',
          a: '你可以随时在个人中心的设置页面删除账户。删除后，所有相关数据（包括历史记录）将被永久删除，无法恢复。',
        },
        {
          q: '可以使用 Google 账号登录吗？',
          a: '可以！我们支持 Google 账号一键登录，无需注册。登录后你的处理历史会自动同步，可以在任何设备上访问。',
        },
        {
          q: '忘记登录了怎么办？',
          a: '如果你使用 Google 账号登录，只需再次点击登录按钮即可。如果你担心隐私，可以在使用后点击"退出"按钮退出登录。',
        },
      ],
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
            <Link href="/pricing" className="text-gray-600 hover:text-gray-800">
              定价
            </Link>
            <Link href="/faq" className="text-blue-600 font-medium">
              FAQ
            </Link>
            {user ? (
              <Link href="/dashboard" className="flex items-center gap-2">
                <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
              </Link>
            ) : (
              <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                登录
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            常见问题
          </h1>
          <p className="text-xl text-gray-600">
            找不到答案？联系我们的客服团队
          </p>
        </div>

        {/* FAQ Categories */}
        {faqs.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{category.category}</h2>
            <div className="space-y-4">
              {category.questions.map((item, questionIndex) => {
                const globalIndex = categoryIndex * 100 + questionIndex
                const isOpen = openIndex === globalIndex
                
                return (
                  <div
                    key={globalIndex}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-800 text-lg">{item.q}</span>
                      <svg
                        className={`w-6 h-6 text-gray-400 transform transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6">
                        <p className="text-gray-600 leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">还有其他问题？</h2>
          <p className="mb-6">我们的客服团队随时为你提供帮助</p>
          <a
            href="mailto:support@imagebackgroundremover.guru"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            联系客服
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">🌀 背景移除工具</h3>
              <p className="text-gray-400">AI 驱动的图片背景移除工具，3 秒完成，无需 PS。</p>
            </div>
            <div>
              <h4 className="font-medium mb-4">产品</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white">首页</Link></li>
                <li><Link href="/pricing" className="hover:text-white">定价</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">支持</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/faq" className="hover:text-white">帮助中心</Link></li>
                <li><a href="mailto:support@imagebackgroundremover.guru" className="hover:text-white">联系我们</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">法律</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">隐私政策</Link></li>
                <li><Link href="/terms" className="hover:text-white">服务条款</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>© 2026 背景移除工具. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
