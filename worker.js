const DEFAULT_DATA = `大婉固执：水滴蛇，火冰乌达，海葵，罗隐，圣剑，翼龙，可立鸡，夏秋冬鸟，高脚鹬，海豹，画精灵，上岸蛙，帕帕，布鲁斯，记忆石，草鹿，卡洛儿，瞌睡王，火狗，伏地兽，红钻，雪熊，雪巨人，黑棋，多西，小箱怪，冰猪
大婉平和：布是石，木偶，菠萝，骨龙，石肤蜥，矿晶虫，小甲虫，大象，瞌睡王，石石，鳗尾兽，柴薪虫，多西，蚊子
大婉沉默：水母，海盔虫，松鼠，鲸鱼，上下弦，里拉鳐，鼠獭，治愈兔，烟花团，圆号鱼
大婉开朗：小萝，草沙冰卡，高脚鹬，天鹅，噼啪鸟，寒音蛇，莎莎，长绒，小丑，草头鸭，春夏冬鸟，星尘虫，黑棋，火狗，月光狮，恶魔狼，小夜
大婉急躁：蜂后，狮鹫，寒音蛇，火狗，斑枭，黑棋，影狸
大婉踏实：喵喵，松鼠，裘卡，呆小路，灵狐，白粉蹦蹦，兽花蕾
大婉胆小：影狸，黑猫，星光狮，咔咔鸟，优优，迪迪，电羊，独角兽，绿枝枝，小丑，鳗鱼，电企鹅，粉星仔，仪使者，莎莎，梦游，睡帽鸭，小灵面，雪娃，火马，龙鱼
大婉聪明：化蝶，蓝枝枝，睡帽鸭
小婉平和：短绒
大粗急躁：亚龙
其他：平和骨龙，固执海豹，冰乌达，开朗狮鹫，急躁海豹，独角兽，胆小依兰龙，急躁混胆小依兰龙，急躁混聪明独角兽`;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }
    const url = new URL(request.url);

    if (request.method === 'GET' && url.pathname === '/api/data') {
      const data = await env.EGG_KV.get('menu');
      return new Response(data || DEFAULT_DATA, {
        headers: { ...CORS, 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }

    if (request.method === 'POST' && url.pathname === '/api/data') {
      const auth = request.headers.get('Authorization') || '';
      if (auth !== 'Bearer ' + (env.ADMIN_PASSWORD || '')) {
        return new Response('unauthorized', { status: 401, headers: CORS });
      }
      const body = await request.text();
      if (!body.trim()) {
        return new Response('empty', { status: 400, headers: CORS });
      }
      await env.EGG_KV.put('menu', body);
      return new Response('ok', { status: 200, headers: CORS });
    }

    return new Response('not found', { status: 404, headers: CORS });
  }
};
