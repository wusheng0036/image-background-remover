export const runtime = 'edge'

export async function POST(request: Request) {
  console.log('API called')
  
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    
    if (!image) {
      return Response.json({ error: '请上传图片' }, { status: 400 })
    }

    if (image.size > 5 * 1024 * 1024) {
      return Response.json({ error: '图片大小不能超过 5MB' }, { status: 400 })
    }

    const apiKey = process.env.REMOVE_BG_API_KEY
    
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      return Response.json({ error: 'API Key 未配置' }, { status: 500 })
    }

    // 调用 Remove.bg API
    const removeBgFormData = new FormData()
    removeBgFormData.append('image_file', image)
    removeBgFormData.append('size', 'preview')

    console.log('Calling remove.bg API...')
    
    const res = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: removeBgFormData
    })

    console.log('remove.bg response status:', res.status)

    if (!res.ok) {
      const errText = await res.text()
      console.error('remove.bg error:', errText)
      
      if (res.status === 402) {
        return Response.json({ error: 'API 额度已用完，请稍后再试' }, { status: 402 })
      }
      
      return Response.json({ error: '处理失败，请重试' }, { status: res.status })
    }

    const imageBuffer = await res.arrayBuffer()
    
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="background-removed.png"'
      }
    })

  } catch (error) {
    console.error('API Error:', error)
    return Response.json({ error: '服务器错误: ' + (error instanceof Error ? error.message : '未知错误') }, { status: 500 })
  }
}
