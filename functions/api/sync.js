// CORS 配置
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Device-ID',
  'Content-Type': 'application/json'
}

export async function onRequest(context) {
  const { request, env } = context

  // 处理 CORS 预检
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // 获取设备 ID
  const deviceId = request.headers.get('X-Device-ID')
  if (!deviceId || deviceId.length < 16) {
    return new Response(
      JSON.stringify({ error: 'Invalid device ID' }),
      { status: 400, headers: corsHeaders }
    )
  }

  const kvKey = `user:${deviceId}`

  // GET: 读取数据
  if (request.method === 'GET') {
    const data = await env.USER_DATA.get(kvKey)
    return new Response(data || '{}', { headers: corsHeaders })
  }

  // POST: 保存数据
  if (request.method === 'POST') {
    const body = await request.json()

    // 验证数据结构
    if (!body || typeof body !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Invalid data format' }),
        { status: 400, headers: corsHeaders }
      )
    }

    // 添加时间戳
    const dataWithMeta = {
      ...body,
      _meta: {
        lastSync: Date.now(),
        deviceId: deviceId
      }
    }

    await env.USER_DATA.put(kvKey, JSON.stringify(dataWithMeta))

    return new Response(
      JSON.stringify({ success: true, timestamp: dataWithMeta._meta.lastSync }),
      { headers: corsHeaders }
    )
  }

  // DELETE: 清除数据
  if (request.method === 'DELETE') {
    await env.USER_DATA.delete(kvKey)
    return new Response(
      JSON.stringify({ success: true }),
      { headers: corsHeaders }
    )
  }

  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { status: 405, headers: corsHeaders }
  )
}
