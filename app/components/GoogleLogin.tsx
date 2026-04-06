'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    google?: any
    handleCredentialResponse?: (response: any) => void
  }
}

export default function GoogleLogin() {
  const [user, setUser] = useState<{name: string, email: string, picture: string} | null>(null)

  useEffect(() => {
    // 检查本地存储
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    // 定义回调函数
    window.handleCredentialResponse = (response: any) => {
      // 解码 JWT
      const base64Url = response.credential.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      const userData = JSON.parse(jsonPayload)
      
      const userInfo = {
        name: userData.name,
        email: userData.email,
        picture: userData.picture
      }
      
      setUser(userInfo)
      localStorage.setItem('user', JSON.stringify(userInfo))
    }

    // 加载 Google Identity Services
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleSignOut = () => {
    setUser(null)
    localStorage.removeItem('user')
    // 重新加载 Google 登录按钮
    if (window.google) {
      window.google.accounts.id.disableAutoSelect()
    }
    window.location.reload()
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <img 
          src={user.picture} 
          alt={user.name} 
          className="w-8 h-8 rounded-full"
        />
        <span className="text-sm text-gray-700 hidden sm:inline">{user.name}</span>
        <button
          onClick={handleSignOut}
          className="bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all shadow-md border border-gray-200 text-sm"
        >
          退出
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div 
        id="g_id_onload"
        data-client_id="940353284015-3gfu2heql1mfr01lpau2kv54gepp5ad3.apps.googleusercontent.com"
        data-callback="handleCredentialResponse"
        data-auto_prompt="false"
      />
      <div 
        className="g_id_signin"
        data-type="standard"
        data-size="large"
        data-theme="outline"
        data-text="sign_in_with"
        data-shape="rectangular"
        data-logo_alignment="left"
      />
    </div>
  )
}
