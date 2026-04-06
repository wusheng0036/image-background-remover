export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    
    if (!image) {
      return new Response(JSON.stringify({ error: '请上传图片' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 验证文件大小（5MB）
    if (image.size > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: '图片大小不能超过 5MB' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 调用 Remove.bg API
    const removeBgFormData = new FormData()
    removeBgFormData.append('image_file', image)
    removeBgFormData.append('size', 'preview')

    const apiKey = process.env.REMOVE_BG_API_KEY
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API Key 未配置' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const res = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: removeBgFormData
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      
      if (res.status === 402) {
        return new Response(JSON.stringify({ error: 'API 额度已用完，请稍后再试' }), {
          status: 402,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      
      return new Response(JSON.stringify({ error: errData.errors?.[0]?.title || '处理失败，请重试' }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 返回处理后的图片
    const imageBuffer = await res.arrayBuffer()
    
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="background-removed.png"'
      }
    })

  } catch (error) {
    console.error('API Error:', error)
    return new Response(JSON.stringify({ error: '服务器错误，请稍后再试' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
