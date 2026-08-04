export async function onRequestGet(context) {
  const data = await context.env.EGG_KV.get('menu_want');
  const ts = await context.env.EGG_KV.get('menu_want_ts');
  const headers = { 'Content-Type': 'text/plain; charset=utf-8' };
  if (ts) headers['X-Data-Updated'] = ts;
  return new Response(data || '', { headers });
}

export async function onRequestPost(context) {
  const auth = context.request.headers.get('Authorization') || '';
  if (auth !== 'Bearer ' + (context.env.ADMIN_PASSWORD || '')) {
    return new Response('unauthorized', { status: 401 });
  }
  const body = await context.request.text();
  await context.env.EGG_KV.put('menu_want', body);
  await context.env.EGG_KV.put('menu_want_ts', String(Date.now()));
  return new Response('ok', { status: 200 });
}
