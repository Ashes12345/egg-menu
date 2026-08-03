export async function onRequestGet(context) {
  const data = await context.env.EGG_KV.get('notes');
  return new Response(data || '', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

export async function onRequestPost(context) {
  const auth = context.request.headers.get('Authorization') || '';
  if (auth !== 'Bearer ' + (context.env.ADMIN_PASSWORD || '')) {
    return new Response('unauthorized', { status: 401 });
  }
  const body = await context.request.text();
  await context.env.EGG_KV.put('notes', body);
  return new Response('ok', { status: 200 });
}
