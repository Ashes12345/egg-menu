export async function onRequestPost(context) {
  const auth = context.request.headers.get('Authorization') || '';
  if (auth !== 'Bearer ' + (context.env.ADMIN_PASSWORD || '')) {
    return new Response('unauthorized', { status: 401 });
  }
  return new Response('ok', { status: 200 });
}
